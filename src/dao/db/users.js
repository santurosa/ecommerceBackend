import { userModel } from "../../models/users.js";
import { createHash, isValidPassword } from "../../utils.js";
import CustomError from "../../service/errors/CustomError.js";
import EErrors from "../../service/errors/enums.js";

export default class Users {

    getUserByEmail = async (email) => {
        try {
            const user = await userModel.findOne({ email: email.toLowerCase() });
            return user;
        } catch (error) {
            throw error;
        }
    }

    getUserById = async (id) => {
        try {
            const user = await userModel.findById(id).lean();
            return user;
        } catch (error) {
            throw error;
        }
    }

    createUser = async (user) => {
        try {
            const creation = await userModel.create(user);
            const result = await userModel.findById(creation._id).lean();
            return result;
        } catch (error) {
            throw error;
        }
    }

    deleteUserById = async (id) => {
        try {
            const result = await userModel.findByIdAndDelete(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    restartPassword = async (email, password) => {
        try {
            const user = await userModel.findOne({ email: email }).lean();
            const comparePassword = isValidPassword(user, password);
            if (comparePassword) CustomError.createError({
                name: "User update error",
                cause: 'You are trying to change the password to the current one.',
                message: "Error Updating password User",
                code: EErrors.INVALID_TYPE_ERROR
            })
            const passwordHash = createHash(password);
            const result = await userModel.updateOne({ email: email }, { password: passwordHash });
            return result;
        } catch (error) {
            throw error;
        }
    }
    updateRole = async (id, role) => {
        try {
            await userModel.updateOne({ _id: id }, { role: role });
            return role;
        } catch (error) {
            throw error;
        }
    }
}