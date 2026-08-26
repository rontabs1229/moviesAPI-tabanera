const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

const { userVerification } = require('../auth');

router.post('/register', userController.registerUser)

router.post("/login", userController.loginUser);

router.get('/details', userVerification, userController.getUserProfile);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log("Error while destroying session: ", err);
        } else {
            req.logout(() => {
                console.log("You are logged out!");

                res.redirect('/');
            })
        }
    })
})

module.exports = router;