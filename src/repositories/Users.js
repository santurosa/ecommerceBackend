import UserDTO from "../dto/user.js";
import { createHash } from "../utils.js";

export default class UserssRepository {
    constructor(dao) {
        this.dao = dao
    }
    getUserByEmail = async (email) => {
        const user = await this.dao.getUserByEmail(email);
        return user;
    }
    getUserById = async (id) => {
        const user = await this.dao.getUserById(id);
        return user;
    }
    createUser = async (first_name, last_name, email, age, password, cart, role) => {
        try {            
            const newUser = new UserDTO({ first_name, last_name, email, age, password: createHash(password), cart, role });
            const result = await this.dao.createUser(newUser);
            return result;
        } catch (error) {
            throw error;
        }
    }
    deleteUserById = async (id) => {
        try {
            const result = await this.dao.deleteUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }
    restartPassword = async (email, password) => {
        try {
            const result = await this.dao.restartPassword(email, password);
            return result;
        } catch (error) {
            throw error;
        }
    }
    updateRole = async (id, role) => {
        try {
            const user = await this.dao.updateRole(id, role);
            return user;
        } catch (error) {
            throw error;
        }
    }
}
