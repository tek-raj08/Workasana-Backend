const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const mongoose  = require("mongoose")
const validator = require("validator")

const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },

    lastName: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email ID.")
            }
        }
    },

    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password.")
            }
        }

    }
},
{
    timestamps: true
}
)

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: '1h'})
    return token;
}

userSchema.methods.validatePassword = async function (password){
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(password, passwordHash)
    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)