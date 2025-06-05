const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const User = require("../models/user.models")


const userAuth = async(req, res, next) => {

    try{


        const token = req.cookies?.token || (req.headers['authorization'] && req.headers['authorization'].split(" ")[1]) ;
        
        if(!token){
            return res.status(404).json({message: "Token is not found."})
        }

        const decodedToken = jwt.verify(token, JWT_SECRET)

        const {_id} = decodedToken;

        const user = await User.findOne({_id})

        if(!user){
            throw new Error("User is not found.")
        }

        req.user = user;

        next()

    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
    
}

module.exports = {userAuth}