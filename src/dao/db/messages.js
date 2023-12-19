import { messagesModel } from "../../models/messages.js";

export default class Messages {
    getMessages = async () => {
        try {
            const messages = await messagesModel.find();
            return messages;
        } catch (error) {
            throw error;
        }
    }

    addMessage = async (user, message) => {
        try {
            const newMessage = await messagesModel.create({
                user,
                message
            })
            return newMessage;
        } catch (error) {
            throw error;
        }
    }
}