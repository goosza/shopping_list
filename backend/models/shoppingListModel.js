const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false},
  archived: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
