const router = require("express").Router();
const users = require("../../userInfo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
POST /auth/signup
The request body contains the following properties:
email: The email of the user
password: The password of the user
The response is sent as JSON
The response contains the following properties:
token: A JWT token
*/
router.post("/signup", async (req, res, next) => {
    const {password, email} = req.body;

    let user = users.find(user => user.email === email);

    if(user) {
        return res.status(400).json({
            "message": "User already exists"
            });
        }      
    
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        email: email,
        password: hashedPassword
    });

    const token = await jwt.sign({
        email: email
    }, "secretkey");

    res.json({token: token});
    

});

/*
POST /auth/login
The request body contains the following properties:
email: The email of the user
password: The password of the user
The response is sent as JSON
The response contains the following properties:
token: A JWT token
*/
router.post("/login", async (req, res, next) => {   
    const {password, email} = req.body;

    let user = users.find(user => user.email === email);

    if(!user) {
        return res.status(400).json({
            "message": "Invalid email or password"
            });
        }
    
    let isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({
            "message": "Invalid email or password"
            });
        }
    const token = await jwt.sign({
        email: email
    }, "secretkey");
    
        res.json({token: token});
    }
);
 

module.exports = router;