const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Get token from header (Bearer <token>)
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'secretKey');

        // Attach user id (from token payload { id: <userId> }) to req
        req.user = decoded.id;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = auth;
