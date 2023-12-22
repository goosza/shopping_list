const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shoppingLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingList' }],
    invitedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingList' }],
});

module.exports = mongoose.model('User', userSchema);