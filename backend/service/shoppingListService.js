const shoppingListModel = require("../models/shoppingListModel");
const userModel = require("../models/userModel");
const itemModel = require("../models/itemModel");
const {createItem} = require("./itemService");
const asyncHandler = require("express-async-handler");

/**
 * Method to get only one shopping list.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const getUserShoppingList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const shoppingListId = req.params.shoppingListId;
  // Ensure that the user has access to the requested shopping list
  const shoppingList = await shoppingListModel.findOne({
    _id: shoppingListId,
    $or: [{ owner: userId }, { invitedUsers: userId }],
  });

  if (!shoppingList) {
    return res.status(404).json({ message: 'Shopping list not found or user does not have access' });
  }

  res.json(shoppingList);
});

/**
 * Fetching all user shopping lists, including those where he is invited one
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const getUserShoppingLists = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const allLists = await shoppingListModel.find({
    $or: [{ owner: userId }, { invitedUsers: userId }],
  });

  if (allLists.length === 0) {
    res.status(404).send('Shopping lists not found.');
    return;
  }

  res.json(allLists);
});

/**
 * Creation of shopping list.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const createShoppingList = asyncHandler(async (req, res) => {
  const userId = req.user.userId; // Assuming the logged-in user's ID is accessible through req.user
  const { name, description, items } = req.body;

  const savedItems = [];
  for (const item of items) {
    //try to add item
    try {
      // Add item to the savedItems array
      const savedItem = await createItem(item);
      savedItems.push(savedItem);
    } catch (error) {
      console.error(`Error adding item to shopping list: ${error}`);
      res.status(500).send('Error creating shopping list');
      return;
    }
  }

  const shoppingList = new shoppingListModel({
    owner: userId,
    name: name,
    description: description,
    invited: [],
    items: savedItems.map(item => item._id)
  });

  try {
    await shoppingList.save();
    // Update the user's shoppingLists array
    const ownerUser = await userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { shoppingLists: shoppingList._id } },
        { new: true } // Return the updated user document
    ).populate('shoppingLists').exec();

    res.status(201).json({
      message: 'Shopping list created successfully',
      user: ownerUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating shopping list');
  }
});

/**
 * Method for inviting users to the shopping list. (Only owner can do it)
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const inviteUser = asyncHandler(async(req, res) => {
  try {
    const userId = req.user.userId;
    const shoppingListId = req.params.shoppingListId;
    const { invitedUsersIds } = req.body;

    // Check if the user making the request is the owner of the shopping list
    const shoppingList = await shoppingListModel.findOne({ _id: shoppingListId, owner: userId });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found or user is not the owner' });
    }

    // Validate and fetch information about the invited users
    const invitedUsers = await userModel.find({ _id: { $in: invitedUsersIds } });

    if (invitedUsers.length !== invitedUsersIds.length) {
      return res.status(400).json({ message: 'Invalid user IDs provided' });
    }
    const successfullyInvitedUsers = [];
    const message = [];
    for (const invitedUser of invitedUsers){
      if (invitedUser.invitedLists.includes(shoppingListId)){
        message.push("User " + invitedUser.username + " has already been already invited.");
      } else {
        // Add invited users to the shopping list
        shoppingList.invitedUsers = shoppingList.invitedUsers.concat(invitedUser._id);
        await shoppingList.save();
        //Add shopping list id to the list of shopping lists where user is invited one.
        invitedUser.invitedLists = invitedUser.invitedLists.concat(shoppingListId);
        //Add invited user to successfully invited to return them.
        successfullyInvitedUsers.push(invitedUser);
        await invitedUser.save();
        message.push("User " + invitedUser.username + " is successfully invited.");
      }
    }

    res.status(200).json({ message: message,
      successfullyInvitedUsers: successfullyInvitedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inviting users to the shopping list');
  }
});

/**
 * Method for adding items to the shopping list.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const addItems = asyncHandler(async(req, res) => {
  try {
    const shoppingListId = req.params.shoppingListId;

    // Fetch the shopping list
    const shoppingList = await shoppingListModel
        .findById(shoppingListId)
        .populate('items');

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    const itemNames = shoppingList.items.map(item => item.name);

    const successfullyAddedItems = [];
    const messages = [];

    for (const additionalItem of req.body.items) {
      if (itemNames.includes(additionalItem.name)) {
        messages.push(`Item ${additionalItem.name} has already been added.`);
      } else {
        try {
          //try to add item
          const savedItem = await createItem(additionalItem);
          shoppingList.items = shoppingList.items.concat(savedItem._id);
          successfullyAddedItems.push(savedItem);
          messages.push(`Item ${savedItem.name} is successfully added.`);
        } catch (error) {
          console.error(`Error adding item to shopping list: ${error}`);
        }
      }
    }
    // Save the updated shopping list
    await shoppingList.save();

    res.status(200).json({ message: messages, successfullyAddedItems });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error adding items to the shopping list');
  }
});

/**
 * Method for shopping list deletion.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const deleteShoppingList = asyncHandler( async(req, res) => {
  try {
    const userId = req.user.userId;
    const shoppingListId = req.params.shoppingListId;

    //Delete shopping list id from the list of shoppingLists
    await userModel.findByIdAndUpdate(
        userId,
        { $pull: { shoppingLists: shoppingListId } },
        { new: true }
    );

    // Find the shopping list and populate the items
    const shoppingList = await shoppingListModel
        .findOne({ _id: shoppingListId, owner: userId })
        .populate('items');

    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found or user is not the owner' });
    }

    // Delete the items associated with the shopping list
    await itemModel.deleteMany({ _id: { $in: shoppingList.items.map(item => item._id) } });
    // Delete the shopping list
    await shoppingListModel.findByIdAndDelete(shoppingListId);

    res.status(200).json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting shopping list');
  }
});

/**
 * Method for shopping list edit.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const updateShoppingList = asyncHandler( async(req, res) => {
  try {
    const userId = req.user.userId;
    const shoppingListId = req.params.shoppingListId;
    const updateData = req.body;

    // Check if the user is owner
    const shoppingList = await shoppingListModel.findOne({ _id: shoppingListId, owner: userId });
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found or user is not the owner' });
    }

    // update shopping list
    const updatedShoppingList = await shoppingListModel.findByIdAndUpdate(
        shoppingListId,
        { $set: updateData },
        { new: true }
    );

    res.status(200).json({ message: 'Shopping list updated successfully',
                           shoppingList: updatedShoppingList });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating shopping list');
  }
})

module.exports = {
  getUserShoppingList,
  getUserShoppingLists,
  createShoppingList,
  inviteUser,
  addItems,
  deleteShoppingList,
  updateShoppingList
};
