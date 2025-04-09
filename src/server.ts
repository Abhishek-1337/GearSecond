import app from "./index";
import mongoose from "mongoose";

mongoose.connect("your_db_string")
        .then(() => {
            console.log("Db connection successful")
        });

app.listen(3000, () => {
    console.log("Listening at port 3000")
});