import express from 'express';
import User from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try{
        console.log(req.body);
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            res.status(400).json({
                message: "All the fields are necessary."
            });
            return;
        }

        const user = await User.create({
            username,
            password,
            email
        });

        const token = await jwt.sign({ userId: user._id }, process.env.jwt_key as string);

        res.status(201).json({
            token,
            message: "user created successfully."
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Something went wrong."
        })
    }
});


router.post("/login", async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password) {
            res.status(400).json({
                message: "fields can't be empty."
            });
            return;
        }

        const user = await User.findOne({email});
        if(!user) {
            res.status(404).json({
                message: "User not found."
            });
            return;
        }

        const token = await jwt.sign({userId: user._id}, process.env.jwt_key as string);
        res.status(200).json({
            token,
            message: "Logged in successfully"
        });
    }
    catch(ex){
        console.log(ex);
        res.status(500).json({
            errorMessage: "Something went wrong."
        })
    }
});

export default router;

