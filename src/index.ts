import express from 'express';
import User from './models/user';

const app = express();

app.use(express.json());

app.post("/api/v1/user/signup", async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = await User.create({
            username,
            password,
            email
        });

        res.status(201).json({
            user,
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

export default app;