const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
    try {
        const token = removeBearer(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ 
                data: { error: { message: "Unauthorised: You must log in to access this resource." } }
            });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifyToken;

        next();
    } catch (error) {
        console.log(error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                data: null, error: { message: "Unauthorised: Invalid token. Please log in again." } 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                data: null, error: { message: "Unauthorised: Your session has expired. Please log in again." } }
            );
        }
        return res.status(500).json({
            data: null, error: { message: "An error occurred during authentication. Please try again later." } }
        );
    }
}
const removeBearer = (tokenWithBearer) => {
    return tokenWithBearer.replace('Bearer ', '');
}

module.exports = {authenticate}