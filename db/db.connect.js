
const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

async function initializeDatabase() {
    try{
        await mongoose.connect(mongoUri)
        console.log("Connected to database.")

    }catch(error){
        console.log("Error connecting to Database", error)
    }
}

module.exports = {initializeDatabase}