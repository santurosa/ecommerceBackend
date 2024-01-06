import UserDTO from "../dto/user.js";
import { createHash } from "../utils.js";

export default class UsersRepository {
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
    getUsers = async (limit, page) => {
        const result = await this.dao.getUsers(limit, page);
        return result;
    }
    createUser = async (first_name, last_name, email, age, password, cart, documents, role) => {
        try {
            const last_connection = new Date();
            const user = new UserDTO({ first_name, last_name, email, age, password: createHash(password), cart, documents, role, last_connection });
            const result = await this.dao.createUser(user);
            return result;
        } catch (error) {
            throw error;
        }
    }
    deleteUser = async (id) => {
        try {
            const result = await this.dao.deleteUser(id);
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
    updateConnection = async (id) =>  {
        try {
            const date = new Date();
            const result = await this.dao.updateConnection(id, date);
            return result;
        } catch (error) {
            throw error;
        }
    }
    updateDocuments = async (id, name, reference) =>  {
        try {
            const result = await this.dao.updateDocuments(id, name, reference);
            return result;
        } catch (error) {
            throw error;
        }
    }
    deleteInactiveUsers = async () => {
        try {
            const limit = new Date(Date.now() - (48 * 60 * 60 * 1000));
            const result = await this.dao.deleteInactiveUsers(limit);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
