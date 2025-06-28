import express from 'express';
import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from '../types/auth';

const router = express.Router();

const tokenization = async (userId: string) => {   
    const access_token = await jwt.sign({ userId: userId }, process.env.access_token_key as string, { expiresIn: '15min'});
    const refresh_token = await jwt.sign({ userId: userId}, process.env.refresh_token_key as string, {
        expiresIn: '7d'
    })
    return { access_token, refresh_token };
};

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

        const { refresh_token, access_token } = await tokenization(user._id as unknown as string);
        res.cookie("refresh_token", `${refresh_token}`, {
            httpOnly: true,
            secure: true
        });
        res.status(201).json({
            access_token,
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

        const { refresh_token, access_token } = await tokenization(user._id as unknown as string);
        res.cookie("refresh_token", `${refresh_token}`, {
            httpOnly: true,
            secure: true
        });
        res.status(200).json({
            access_token,
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

// router.get("refresh", (req, res) => {
//     try{
        
//     }
//     catch(ex){
//         res.status(500).json({
//             errorMessage: "Something went wrong."
//         });
//     }
// });

router.get("/me", async (req:AuthRequest, res) => {
    try{
        if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
            res.status(403).json({
                message: "No token provided"
            });
            return;
        }
        const token = req.headers.authorization?.split(" ")[1];

        const decoded = await jwt.verify(token, process.env.access_token_key as string);
        if(!decoded){
             res.status(403).json({
                 message: "Token is invalid."
             });
             return;
         }
     
         const userId = (decoded as JwtPayload).userId;
         const user = await User.findById(userId).select('-password -__v');
         if(!user) {
            res.status(404).json({
                message: "No user found."
            });
            return;
         }
         res.status(200).json({
            user
         });
    }
    catch(err){
        res.status(500).json({
            message: "Something went wrong"
        })
    }
});

export default router;

