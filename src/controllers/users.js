import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { cartsService, productsService, usersService } from "../repositories/index.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";
import MailingService from "../service/maling/mailing.js";

export const getUsers = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const { users, hasPrevPage, hasNextPage, nextPage, prevPage } = await usersService.getUsers(limit, page);
        res.send({ status: "success", payload: users, hasPrevPage, hasNextPage, nextPage, prevPage });
    } catch (error) {
        next(error);
    }
}

export const recoverPassword = async (req, res, next) => {
    try {
        const { email } = req.query;
        const domain = `${req.protocol}://${req.get('host')}`;
        const isUser = await usersService.getUserByEmail(email);
        if (!isUser) CustomError.createError({
            name: "User trying update error",
            cause: `The email ${email} is not an ecommerce user.`,
            message: "Error trying update User's password",
            code: EErrors.INVALID_PARAMS_ERROR
        })
        const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
        const mailer = new MailingService();
        mailer.sendSimpleMail({
            from: 'E-Commerce <santurosa999@gmail.com>',
            to: email,
            subject: 'Restablecer contraseña',
            html: `<div><p> ¡Hola! Haz pedido cambiar tu contraseña de usuario. Hace click en el botón de abajo para cambiarla </p>
            <a href="${domain}/restartpassword/${token}">Restablecer contraseña</a><div>`
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
        if (user.role === 'user') {
            const hasProfile = user.documents.some(documento => documento.name === 'profile');
            if ((hasProfile && user.documents.length > 3) || (!hasProfile && user.documents.length > 2)) {
                result = await usersService.updateRole(id, 'user_premium');
            } else CustomError.createError({
                name: "User update error",
                cause: 'Documentation needs to be uploaded to the user to change their role to "user_premium".',
                message: "Error updating User's role by ID",
                code: EErrors.FORBIDDEN_ERROR
            })
        }
        else if (user.role === 'user_premium') result = await usersService.updateRole(id, 'user');
        else CustomError.createError({
            name: "User update error",
            cause: `To change the user's role it must be "user" or "user_premium". It was received as a role when searching for the user: ${user.role}.`,
            message: "Error updating User's role by ID",
            code: EErrors.INVALID_TYPE_ERROR
        })
        res.send({ status: "success", message: `The user's role has been successfully changed`, new_role: result });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.uid;
        const user = await usersService.deleteUser(id);
        await cartsService.deleteCart(user.cart._id);
        res.send({ status: "success", payload: user });
    } catch (error) {
        next(error);
    }
}

export const deleteInactiveUsers = async (req, res, next) => {
    try {
        const result = await usersService.deleteInactiveUsers();
        await cartsService.deleteCarts(result.carts);
        const users = result.usersEmails;
        if (users > 0) {
            const mailer = new MailingService();
            mailer.sendSimpleMail({
                from: 'E-Commerce <santurosa999@gmail.com>',
                to: users,
                subject: 'Eliminación de su cuenta por falta de actividad',
                html: `<p>¡Hola! Lamentamos informarte que hemos eliminado su cuenta debido a la falta de actividad reciente. Si deseas volver, simplemente regístrese nuevamente.</p>`
            })
        }
        res.send({ status: "success", message: `${result.deletedUsers} inactive users have been deleted` });
    } catch (error) {
        next(error);
    }
}

export const updateDocuments = async (req, res, next) => {
    try {
        const id = req.params.uid;
        const updates = [];
        if (!req.files) CustomError.createError({
            name: "User add documents error",
            cause: 'A file has not been sent in the body.',
            message: "Error updating User's documents by ID",
            code: EErrors.INVALID_TYPE_ERROR
        })
        if (req.files.profile) {
            const file = req.files.profile[0]
            const result = await usersService.updateDocuments(id, 'profile', file.path)
            updates.push(result);
        }
        if (req.files.documents) {
            const files = req.files.documents
            for (let i = 0; i < files.length; i++) {
                const result = await usersService.updateDocuments(id, files[i].filename, files[i].path)
                updates.push(result);
            }
        }
        if (req.files.thumbnail) {
            const user = await usersService.getUserById(id);
            const files = req.files.thumbnail;
            for (let i = 0; i < files.length; i++) {
                const result = await productsService.updateThumbnails(user.email, req.body.id, files[i].path)
                updates.push(result);
            }
        }

        res.send({ status: 'success', message: 'Files uploaded successfully', files: req.files, updates });
    } catch (error) {
        next(error);
    }
}