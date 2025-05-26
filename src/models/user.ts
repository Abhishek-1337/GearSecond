import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        lowercase: true,
        required: [true, "Username can't be empty."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide an email address"],
        validate: {
            validator: function (email: string) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }, 
            message: "Please provide a valid email."
        }
    },
    password: {
        type: String,
        required: [true, "Password field can't be empty."],
        validate: {
            validator: function (password: string): boolean {
                const passwordRegex =
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                return passwordRegex.test(password);
            },
            message: "Please provide a strong password"
        }
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified) return next();
    this.password = await bcrypt.hash(this.password, Number(process.env.salt_round) || 10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;