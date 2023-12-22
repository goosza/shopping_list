const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String, required: false },
    quantity: { type: Number, required: false},
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Item", itemSchema);