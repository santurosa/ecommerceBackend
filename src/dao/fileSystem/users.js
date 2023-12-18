import { userModel } from "../../models/users.js";
import UserDTO from "../../dto/user.js";
import { createHash, isValidPassword } from "../../utils.js";

export default class Users {

    getUserByEmail = async (email) => {
        try {
            const user = await userModel.findOne({ email: email.toLowerCase() });
            return user;
        } catch (error) {
            throw error;
        }
    }
    
    createUser = async (first_name, last_name, email, age, password, cart, role) => {
        try {
            const newUser = new UserDTO({ first_name, last_name, email, age, password: createHash(password), cart, role });
            const result = await userModel.create(newUser);
            return result;
        } catch (error) {
            throw error;
        }
    }
}