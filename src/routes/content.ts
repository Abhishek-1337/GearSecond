import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware";
import Content from "../models/content";
import { AuthRequest } from "../types/auth";

const router = express.Router();

router.post("/", authMiddleware.protect, async (req: AuthRequest, res) => {
    try{
        const { link, type, title, tags } = req.body;
        if(!link || !type || !title ) {
            res.status(400).json({
                message: "Fields cant remain empty."
            });
            return;
        }

        const userId = req.userId;
        const content = await Content.create({
            link,
            type, 
            title,
            tags,
            userId
        });
        res.status(201).json({
            content,
            message: "Content added successfully."
        })

    }
    catch(ex){
        res.status(500).json({
            message: "Something went wrong."
        });
    }
});


router.delete("/:contentId", authMiddleware.protect, async (req: AuthRequest, res) => {
    try{
        const { contentId } = req.params;
        const userId = req.userId;
        const content = await Content.findById(contentId);

        if(!content) {
            res.status(404).json({
                message: "No content found with this id."
            });
            return;
        }

        if(userId !== content.userId?.toString()) {
            res.status(403).json({
                message: "Access denied."
            });
            return;
        }

        const deletedContent = await Content.deleteOne({_id: content._id, userId: userId});
        res.status(200).json({
            deletedContent,
            message: "Delete successfully."
        });
        return;
    }
    catch(ex){

    }
});

router.put("/:contentId", authMiddleware.protect, async (req: AuthRequest, res) => {
    const userId = req.userId;
    const { contentId } = req.params;
    try{
        const content = await Content.findById(contentId);

        if(!content){
            res.status(404).json({
                message: "No content found with this id."
            });
            return;
        }

        if(userId !== content.userId.toString()){
            res.status(403).json({
                message: "Access denied."
            });
            return;
        }

        const updatedItem = await Content.findByIdAndUpdate(content._id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            updatedItem,
            message: "Here's the updated item."
        });
    }
    catch(ex){
        console.log(ex);
    }
});

router.get("/all", authMiddleware.protect, async (req: AuthRequest, res) => {
    const userId = req.userId;
    try{

        const contents = await Content.find({userId: userId});
        if(contents.length === 0){
            res.status(200).json({
                message: "Didn't find any content for you."
            });
            return;
        }

        res.status(200).json({
            contents,
        });
    }
    catch(ex){
        console.log(ex);
    }
});

export default router;