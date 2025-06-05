const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uniquie: true
    },

    member: {
        type: [String]
    },

    description: {
        type: String,
    }
})

module.exports = mongoose.model("Team", teamSchema)