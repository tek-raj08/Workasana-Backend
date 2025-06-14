const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const User = require("../models/user.models")


const userAuth = async(req, res, next) => {

    try{


        const token = req.cookies?.token || (req.headers['authorization']?.split(" ")[1]);
        
        if(!token){
            return res.status(401).json({message: "Invalid Credentials. Please Login."})
        }

        const decodedToken = jwt.verify(token, JWT_SECRET)

        const {_id} = decodedToken;

        const user = await User.findById({_id})

        if(!user){
            throw new Error("User not found.")
        }

        req.user = user;

        next()

    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
    
}

module.exports = {userAuth}