import userModel from "../../models/user.models.js";
import { hashPassword, comparePassword } from "../../../utils.js";


export default class UserManager {
    createUser = async (user) => {
        if (user.email === "adminCoder@coder.com") {
            user.role = "admin";
        } else {
            user.role = "user";
        }
        const pswHashed = await hashPassword(user.password);

        const newUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: pswHashed,
            age : user.age,
            role: user.role,
        }
        const result = await userModel.create(newUser);
        //console.log(newUser);
        return result;
    }
    loginUser = async (user) => {
        const userFound = await userModel.findOne({ email: user.email });
        if (!userFound) {
            return "User not found";
        }
        const isMatch = await comparePassword(user.password, userFound.password);
        if (!isMatch) {
            return "Incorrect password";
        }
        return userFound;
    }
    recoverPassword = async (user) => {
        const userFound = await userModel.findOne({ email: user.email });
        if (!userFound) {
            return "User not found";
        }
        const pswHashed = await hashPassword(user.password);
        userFound.password = pswHashed;
        await userFound.save();
        return userFound;
    }
}