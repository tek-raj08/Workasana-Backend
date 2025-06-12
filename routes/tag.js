const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Tag = require("../models/tag.models")
const tagRouter = express.Router();

tagRouter.post("/tags",userAuth, async(req, res) => {

    try{
        const {name} = req.body;
        const tags = new Tag({
            name
        })

        const saveTag = await tags.save();

        res.status(200).json({message: "Tags added succssfully", tags: saveTag})
    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})

tagRouter.get("/tags",userAuth, async(req, res) => {

    try{
        const tags = await Tag.find()
        
        res.status(200).json({message: "Retrieve all tags successfully.", tags})

    }catch(err){
        res.status(500).json({ERROR: err.message})
    }
})

module.exports = {tagRouter}