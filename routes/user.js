const express = require("express")
const { userAuth } = require("../middlewares/userAuth")
const User = require("../models/user.models")

const userRouter = express.Router()

userRouter.get("/users", userAuth, async(req, res) => {
    try{
        const users = await User.find()

        res.status(200).json({message: "All user retrieve successfully.", users})


    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})

module.exports = {userRouter}