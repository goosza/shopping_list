const itemModel = require("../models/itemModel");
const asyncHandler = require("express-async-handler");

/**
 * Service method for creating items while creation
 * shopping list or just adding it from shopping list details.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const createItem = asyncHandler( async (itemData) => {
    try {
        const newItem = new itemModel({
            name: itemData.name,
            details: itemData.details,
            quantity: itemData.quantity
        });

        const savedItem = await newItem.save();
        console.log(`Item added successfully: ${savedItem}`);

        return savedItem;
    } catch (error) {
        console.error(`Error creating item: ${error}`);
        throw error;
    }
});

/**
 * Method for deleting item from the shopping list.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const deleteItem = asyncHandler( async(req, res) => {

});

/**
 * Method to edit information about the item in the shopping list.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const editItem = asyncHandler( async(req, res) => {

});

module.exports = {
    createItem,
    editItem,
    deleteItem
};