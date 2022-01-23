const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
//1 hour
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    //console.log(req.body.password)
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        })
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(200).json(err);
    }
})

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        console.log(deletedUser)
        if (deletedUser)
            return res.status(200).json({ "message": "deleted", deletedUser })
    }
    catch (err) {
        res.status(500).json(err);
    }
})
//Get One User Admin
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        if (user) {
            const { password, ...others } = user._doc;
            return res.status(200).json(others)
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//Get All User Admin
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find(req.params.id);
        if (users) {
            //const { password, ...others } = users._doc;
            return res.status(200).json(users)
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;