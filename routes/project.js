const express = require("express")
const Project = require("../models/project.models")
const { userAuth } = require("../middlewares/userAuth")

const projectRouter = express.Router()

projectRouter.post("/projects", userAuth, async(req, res) => {
    try{
        const {name, description, status} = req.body

        const projectData = new Project({
            name,
            description,
            status
        })

        const saveProject = await projectData.save()

        res.status(200).json({message: "Project added successfully.", project: saveProject})

    }catch(error){
        res.status(500).json({ERROR: error.message})
    }
})

projectRouter.get("/projects", userAuth, async(req, res) => {

    try{
        const projects = await Project.find()
        res.status(200).json({message: "Retrieve all projects", projects})

    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})

module.exports = {projectRouter}