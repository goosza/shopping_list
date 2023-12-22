const jwt = require('jsonwebtoken');

/**
 * Middleware method for user verification when calling the endpoints from client.
 * (Based on JWT Security). Supposed that JWT token will be included within the request with user
 * details.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        // Attach the decoded user information to the request object for further use
        req.user = decoded;
        console.log(req.user);
        next();
    });
};

module.exports = authenticateJWT;