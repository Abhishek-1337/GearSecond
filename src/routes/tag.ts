import express from "express";
import Tag from "../models/tag";

const router = express.Router();

router.post("/", async (req, res) => {
    const { tagName } = req.body;
    try{
        const tag = await Tag.findOne({name: tagName});
        if(tag){
            res.status(400).json({
                message: "Tag already exist" 
            });
            return;
        }

        const newTag = await Tag.create({
            name: tagName
        });
        res.status(201).json({
            message: "Tag created successfully."
        });
    }
    catch(err){
        res.status(500).json({
            message: "Something went wrong."
        });
    }
});

export default router;