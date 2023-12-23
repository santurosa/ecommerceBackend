import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { usersService } from "../repositories/index.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import MailingService from "../service/maling/mailing.js";

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
        const user = {
            _id: req.user._id,
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
            role: req.user.role
        }
        const token = jwt.sign(user, config.jwtSecret, { expiresIn: '1h' });
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

export const logout = (req, res) => {
    try {
        res.cookie('token', '', { expires: new Date(0), httpOnly: true }).redirect('/login');
    } catch (error) {
        throw error;
    }
}

export const githubcallback = async (req, res) => {
    const user = req.user;
    delete user.password;
    req.user = user;
    res.redirect("/products");
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

export const recoverPassword = async (req, res, next) => {
    try {
        const { email } = req.query;
        const isUser = await usersService.getUserByEmail(email);
        if (!isUser) CustomError.createError({
            name: "User trying update error",
            cause: `The email ${email} is not an ecommerce user.`,
            message: "Error trying update User's password",
            code: EErrors.INVALID_PARAMS_ERROR
        })
        const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
        const mailer = new MailingService();
        const result = mailer.sendSimpleMail({
            from: 'E-Commerce <santurosa999@gmail.com>',
            to: email,
            subject: 'Restablecer contraseña',
            html: `<div><p> ¡Hola! Haz pedido cambiar tu contraseña de usuario. Hace click en el botón de abajo para cambiarla </p>
            <a href="http://localhost:8080/restartpassword/${token}">Restablecer contraseña</a><div>`
        })
        res.cookie('recoverPassword', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).send({ status: "success", message: `We will send you an email to ${email} so you can change your password` });
    } catch (error) {
        next(error);
    }
}
export const restartPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await usersService.restartPassword(email, password);
        res.cookie('recoverPassword', '', { expires: new Date(0), httpOnly: true });
        res.send({ status: "success", message: "Password changed successfully", result });
    } catch (error) {
        next(error);
    }
}

export const updateRole = async (req, res, next) => {
    try {
        const id = req.params.uid;
        let result;
        const user = await usersService.getUserById(id);
        if (user.role === 'user') result = await usersService.updateRole(id, 'user_premium');
        else if (user.role === 'user_premium') result = await usersService.updateRole(id, 'user');
        else CustomError.createError({
            name: "User update error",
            cause: `To change the user's role it must be "user" or "user_premium". It was received as a role when searching for the user: ${user.role}.`,
            message: "Error updating User's role by ID",
            code: EErrors.INVALID_TYPE_ERROR
        })
        res.send({ status: "success", message: `The user's role has been successfully changed to ${result}` });
    } catch (error) {
        next(error);
    }
}

export const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.uid;
        const result = await usersService.deleteUserById(id);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}