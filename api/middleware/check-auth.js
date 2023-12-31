const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "Authentication failed"
            })
        }
        const token = req.headers.authorization.split(" ")[1];  
        decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed"
        })
    }
     
}