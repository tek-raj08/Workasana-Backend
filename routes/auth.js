const express = require("express")
const { validateSingupData } = require("../utils/validation")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const User = require("../models/user.models")
const { userAuth } = require("../middlewares/userAuth")


const authRouter = express.Router();

authRouter.get("/auth/check", userAuth, async(req, res) => {
    try{

       return res.status(200).json({ message: "Authenticated" }); 
    }catch(err){
       return res.status(401).json({error: "Not Authenticated."})
    }
})

authRouter.post("/auth/signup", async (req, res) => {

    try {

        // validate data
        validateSingupData(req);
        const { firstName, lastName, email, password } = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message: "User already exists, Please Login."})
        }

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
            return res.status(404).json({message: "Invalid Credentials."})
        }

        const isPasswordValid = await user.validatePassword(password); // --> from user model

        if (isPasswordValid) {

            // get token from user model
            const token = await user.getJWT(); // --> from user model

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,          // Set to true in production with HTTPS
                sameSite: "None",
                      // 24 hour
            },
            {expires: new Date(Date.now() + 24 * 3600000)}
        );
            // console.log(decodedToken);

            return res.status(201).json({ message: "Login Successfull.", token,  user })
        } else {
            return res.status(404).json({ message: "Invalid Credentials." })
        }

    } catch (err) {
        console.error(err)
       return res.status(500).json({ ERROR: "User failed to Login." })
    }
})

authRouter.post("/auth/logout", async(req, res) => {

    res.cookie("token", null, {
       expires: new Date(Date.now())
    })

    return res.status(201).json({message: "Logged out Successfully."})
})


authRouter.get("/", (req, res) => {
    res.json("Hello Server!")
})
module.exports = { authRouter }