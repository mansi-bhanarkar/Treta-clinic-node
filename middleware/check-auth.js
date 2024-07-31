const jwt = require('jsonwebtoken');

function checkauth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // const decodedToken = jwt.verify(token , process.env.JWT_KEY);
        const decodedToken = jwt.verify(token, 'secret');
        req.userData = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({
            status:401,
            message: "Invalid Token.",
            error: error
        });
    }
}

module.exports = {
    checkauth: checkauth
}