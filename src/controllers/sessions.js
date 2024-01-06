import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { usersService } from "../repositories/index.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
        if(req.user.email != config.admin.NAME) await usersService.updateConnection(req.user._id);
        const user = {
            _id: req.user._id,
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
            documents: req.user.documents,
            role: req.user.role
        }
        const token = jwt.sign(user, config.jwt.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).send({ status: "success", user });
    } catch (error) {
        req.logger.error(`The cause is '${error}' in ${req.method} at ${req.url} - ${new Date().toString()} `);
        res.status(401).send({ status: "error", error: "Credenciales incorrectas" });
    }
}

export const failLogin = (req, res) => {
    res.send({ status: "error", message: "Failed login" });
}

export const register = async (req, res) => {
    res.send({ status: "success", message: "User registered" });
}

export const failRegister = (req, res) => {
    res.send({ status: "error", message: "Failed register" });
}

export const logout = async (req, res) => {
    try {
        if(req.user.email != config.admin.NAME) await usersService.updateConnection(req.user._id);
        res.cookie('token', '', { expires: new Date(0), httpOnly: true }).redirect('/login');
    } catch (error) {
        throw error;
    }
}

export const githubcallback = async (req, res) => {
    const user = {
        _id: req.user._id,
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        documents: req.user.documents,
        role: req.user.role
    }
    const token = jwt.sign(user, config.jwt.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).redirect("/products");
}

export const current = (req, res) => {
    if (req.user) {
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
            role: req.user.role
        }
        res.send({ status: "success", user });
    } else {
        res.send({ status: "error", message: "No hay un usuario logueado" });
    }
}