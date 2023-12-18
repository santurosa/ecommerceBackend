import config from "../config/config.js";
import { usersService } from "../repositories/index.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import MailingService from "../service/maling/mailing.js";

export const login = async (req, res) => {
    try {
        if(!req.user) return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
        req.session.user = {
            _id: req.user._id,
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
            role: req.user.role
        }
        res.send({ status: "success", payload: req.session.user });
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
    req.session.destroy(error => {
        if (error) return res.send({ status: "Logout ERROR", body: error });
        res.redirect("/login");
    })
}

export const githubcallback = async (req, res) => {
    const user = req.user;
    delete user.password;
    req.session.user = user;
    res.redirect("/products");
}

export const current = (req, res) => {
    const user = req.session.user;
    if (user) {
        res.send({ status: "success", user });
    } else {
        res.send({ status: "error", message: "No hay un usuario logueado" });
    }
}

export const recoverPassword = (req, res) => {
    const { email } = req.query;
    try {
        const mailer = new MailingService(); 
        const result = mailer.sendSimpleMail({
            from: 'E-Commerce <santurosa999@gmail.com>',
            to: email,
            subject: 'Restablecer contraseña',
            html: `<div><p> ¡Hola! Haz pedido cambiar tu contraseña de usuario. Hace click en el botón de abajo para cambiarla </p>
            <a href="http://localhost:8080/restartpassword">Restablecer contraseña</a><div>`
        })
        req.session.recoverPassword = email;
        res.send({ status: "success", message: `We will send you an email to ${email} so you can change your password` });        
    } catch (error) {
        throw error;
    }
}

export const restartPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!req.session.recoverPassword || req.session.recoverPassword != email) {
            CustomError.createError({
                name: "User update error",
                cause: `The link has expired or it does not match the email that requested to reset the password.`,
                message: "Error updating User's password",
                code: EErrors.FORBIDDEN_ERROR
            })
            return res.redirect('/login');
        }
        const result = await usersService.restartPassword(email, password);
        req.session.recoverPassword.destroy(error => {
            if (error) return res.send({ status: "Logout ERROR", body: error });
            res.redirect("/login");
        })
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