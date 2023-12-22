const express = require("express");
const {
    createUser,
    authenticateUser
} = require("../service/userService");

const router = express.Router();

router.post("/register", createUser);
router.get("/login", authenticateUser);

module.exports = router;
