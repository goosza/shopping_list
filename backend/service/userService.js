const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Method for user creation. (Registration)
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const createUser = asyncHandler(async (req, res) => {// Assuming the logged-in user's ID is accessible through req.user
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Missing email or password');
    }
    if (await checkUserExists(email)){
        return res.status(400).send('User with such email already exists');
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const user = new userModel({
        username: username,
        email: email,
        password: hashedPassword,
        shoppingLists: [],
        invitedLists: []
    });

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

// Creates hashed password
const hashPassword = (password, salt) => {
    return bcrypt.hashSync(password, salt);
};

// Generates a 12-character salt
const generateSalt = () => {
    return bcrypt.genSaltSync(12);
};

const checkUserExists = async (email) => {
    const user = await userModel.findOne({ email });
    return !!user;
};

/**
 * User authentication method, which returns JWT token based on user details.
 * JWT token should be valid when calling the endpoints.
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const authenticateUser = asyncHandler (async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing login or password');
    }
    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const isPasswordValid = await comparePasswords(password, user.password, user.salt);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
    }
    // Set the user ID in the session
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

    // Successful authentication
    res.status(200).json({ token });
});

/**
 * Method for password validation.
 * @param enteredPassword
 * @param hashedPassword
 * @param salt
 * @returns {Promise<*>}
 */
const comparePasswords = async (enteredPassword, hashedPassword, salt) => {
    return await bcrypt.compare(enteredPassword, hashedPassword, salt);
};



module.exports = {
    createUser,
    authenticateUser
};
