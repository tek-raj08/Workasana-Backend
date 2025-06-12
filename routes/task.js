const express = require("express");
const Task = require("../models/task.models");
const User = require("../models/user.models");
const Team = require("../models/team.models");
const Project = require("../models/project.models");
const { userAuth } = require("../middlewares/userAuth");

const taskRouter = express.Router();

taskRouter.post("/tasks", async(req, res) => {

    try{
        const {name, project, team, owners, tags, timeToComplete, priority, status, dueDate} = req.body;
        const tasks =  new Task({
            name,
            project,
            team,
            owners,
            tags,
            timeToComplete,
            priority,
            status,
            dueDate

        })

        const saveTask = await tasks.save();

        res.status(200).json({message: "Task added successfully", tasks: saveTask})

    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})

taskRouter.post("/tasks/:taskId", async(req, res) => {

    try{
        const taskId = req.params.taskId
        const updateData = req.body

        const updateTask = await Task.findByIdAndUpdate(taskId, updateData, {new:true})
        res.status(200).json({message: "Task updated successfully.", tasks: updateTask})
    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})

taskRouter.get("/tasks", async(req, res) => {
    try{

        const {team, owners, tags, project, status} = req.query

        const filter = {}

        if(team) {
            const teamName = await Team.findOne({name: team})

            if(teamName) filter.team = teamName._id
        }

        if(owners){
            const ownersNames = owners.split(",").map(name => name.trim())

            const users = await User.find({
                $or: ownersNames.map(name => {
                    const [firstName, ...lastNameParts] = name.split(" ")
                    const lastName = lastNameParts.join(" ")
                    return {firstName, lastName}
                })
            })

            const userIds = users.map(user => user._id)

            filter.owners = {$all: userIds}
        }

            
        if(project){
            const projectName = await Project.findOne({name: project})

            if(projectName) filter.project = projectName._id
        }
        
        
        if(tags) filter.tags = {$in: tags.split(",").map((t) => t.trim())};
        
        if(status) filter.status = status;

        const tasks = await Task.find(filter)
        .populate({path: "project", select: "name", strictPopulate: false})
        .populate({path: "team", select: "name", strictPopulate: false})
        .populate({path: "owners", select: "firstName lastName", strictPopulate:false})
        res.status(200).json({message: "Retrieve all tasks successfully.", tasks})
    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
    
})


 taskRouter.post("/tasks/:taskId/add-member", async(req, res) => {
    try{
        const {taskId} = req.params;
        const {ownerId} = req.body;


        const updatedTask = await Task.findByIdAndUpdate(taskId, {$addToSet: {owners: ownerId}}, {new:true})

        res.status(200).json({message: "New Team Member add successfully.", updatedTask})

    }catch(err){
        res.status(500).json({ERROR: err.message })
    }
})
module.exports = {taskRouter}
