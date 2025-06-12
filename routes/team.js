const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Team = require("../models/team.models")

const teamRouter = express.Router();

teamRouter.post("/teams", async(req, res) => {

    try{
        const {name, member, description} = req.body;

        const team = new Team({
            name,
            member,
            description
        })

        const saveTeam = await team.save();

        res.status(200).json({message: "Team added successfully.", teams: saveTeam})
    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
    
})

teamRouter.get("/teams", async(req, res) => {

    try{

        const teams = await Team.find()
        res.status(200).json({message: "Retrieve all the teams.", teams})
    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})



module.exports = {teamRouter}