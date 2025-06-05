const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
        enum: ["In Progress", "Completed"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Project", projectSchema)