import app from "./index";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://abhishekrinku4:UEuhYKIqbxBNdl8i@cluster0.8xpjn8o.mongodb.net/GearSecond")
        .then(() => {
            console.log("Db connection successful")
        });

app.listen(3000, () => {
    console.log("Listening at port 3000")
});