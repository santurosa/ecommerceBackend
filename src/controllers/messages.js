import { messagesService } from "../repositories/index.js";
import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await messagesService.getMessages();
        res.send(messages);
    } catch (error) {
        req.logger.error(`The cause is '${error}' in ${req.method} at ${req.url} - ${new Date().toString()} `);
        res.status(500).send({ status: "error", error });
    }
}

export const addMessage = async (req, res, next) => {
    try {
        const { user, message } = req.body;
        if (!user || !message) CustomError.createError({
            name: "Message post error",
            cause: createMessageErrorInfo({ user, message }),
            message: "Error creating Message",
            code: EErrors.INVALID_TYPE_ERROR
        })
        const result = await messagesService.addMessage(user, message);
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(error);
    }
}