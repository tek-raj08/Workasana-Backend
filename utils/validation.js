const validator = require("validator")
const validateSingupData = async(req) => {

    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid.")
    }else if(!validator.isEmail(email)){
        throw new Error("Enter valid email ID.")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password.")
    }
}

module.exports = {validateSingupData}