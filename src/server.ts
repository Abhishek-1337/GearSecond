import app from "./index";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.db_url)
mongoose.connect(process.env.db_url as string)
        .then(() => {
            console.log("Db connected successfully.");
        })
        .catch((err) => {
            console.log(err);
        })

app.listen(3000, () => {
    console.log("Listening at port 3000")
});