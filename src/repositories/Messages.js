import MessageDTO from "../dto/message.js";

export default class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }
    getMessages = async () => {
        const messages = await this.dao.getMessages();
        return messages;
    }
    addMessage = async (user, message) => {
        const newMessage = new MessageDTO({ user, message })
        const result = await this.dao.addMessage(newMessage.user, newMessage.message);
        return result;
    }
}