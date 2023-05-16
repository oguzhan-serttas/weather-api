const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(400).json({
            "message": "No token, authorization denied"
            });
        }

        try {
            let user = await jwt.verify(token, "secretkey");
            req.user = user.email;
            next();
        } catch (error) {
            return res.status(400).json({
                "message": "Token is not valid"
                });
        }
        

    }
