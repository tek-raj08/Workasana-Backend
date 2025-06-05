const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    project: {
        type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true
    },

    team: {
        type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true
    },

    owners: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
        }
    ],

    tags: [{
        type: String
    }],

    timeToComplete: {
        type: Number, required: true
    },

    priority: {
        type: String,
        enum: ["High", "Medium", "Low"]
    },

    dueDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed", "Blocked"],
        default: "To Do"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

})

taskSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model("Task", taskSchema)