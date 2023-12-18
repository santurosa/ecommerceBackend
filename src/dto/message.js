export default class MessageDTO {
    constructor(message) {
        this.user = message.user.toLowerCase().trim(),
            this.message = message.message.trim()
    }
}