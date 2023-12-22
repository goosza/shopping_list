const express = require("express");
const {
    getUserShoppingList,
    getUserShoppingLists,
    createShoppingList,
    inviteUser,
    addItems,
    deleteShoppingList,
    updateShoppingList
} = require("../service/shoppingListService");

const authenticateUser = require("../service/authenticate")

const router = express.Router();

router.use(authenticateUser);

router.get("/all", getUserShoppingLists);
router.get("/:shoppingListId", getUserShoppingList);
router.post("/create", createShoppingList);
router.post("/:shoppingListId/invite", inviteUser);
router.post("/:shoppingListId/add_items", addItems);
router.delete("/:shoppingListId/delete", deleteShoppingList);
router.put("/:shoppingListId/update", updateShoppingList);

module.exports = router;
