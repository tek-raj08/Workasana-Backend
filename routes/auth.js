const express = require("express")
const { validateSingupData } = require("../utils/validation")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const User = require("../models/user.models")
const { userAuth } = require("../middlewares/userAuth")


const authRouter = express.Router();

authRouter.post("/auth/signup", async (req, res) => {

    try {

        // validate data
        validateSingupData(req);
        const { firstName, lastName, email, password } = req.body

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10)

        const userData = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        })


        const saveData = await userData.save()

        res.status(200).json({ message: "Signup Successfully.", User: saveData })

    } catch (err) {
        res.status(500).json({ ERROR: err.message })
    }

})


authRouter.post("/auth/login", async (req, res) => {


    try {

        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(404).json({ message: "Invalid Credentials." })
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(404).json({ message: "Invalid Credentials." })
        }

        const user = await User.findOne({
            email,
        })

        if (!user) {
            throw new Error("User not found.")
        }
        const isPasswordValid = await user.validatePassword(password); // --> from user model
        if (isPasswordValid) {

            // get token from user model
            const token = await user.getJWT(); // --> from user model

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,          // Set to true in production with HTTPS
                sameSite: "Strict",
                maxAge: 1 * 3600000         // 1 hour
            });
            // console.log(decodedToken);

            return res.status(201).json({ message: "Login Successfull.", user })
        } else {
            throw new Error("Invalid Credentials")
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

authRouter.post("/auth/logout", async(req, res) => {

    res.clearCookie(userAuth, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })

    res.status(200).json({message: "Logged out Successfully."})
})


authRouter.get("/", (req, res) => {
    res.json("Hello Server!")
})
module.exports = { authRouter }