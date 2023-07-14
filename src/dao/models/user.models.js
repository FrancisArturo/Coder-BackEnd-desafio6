import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    password: String,
    role: String,
});

const userModel = mongoose.model("users", userSchema);

export default userModel;