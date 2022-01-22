const User = require("../models/User");

const router = require("express").Router();
const CryptoJS = require("crypto-js");
//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(401).json("Wrong credentials")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (Originalpassword !== req.body.password)
            return res.status(401).json("Wrong credentials")
        const { password, ...others } = user._doc;
        return res.status(200).json(others)

    }
    catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
})
module.exports = router;