import CustomError from "../service/errors/CustomError.js";
import EErrors from "../service/errors/enums.js";

export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao
    }
    createTicket = async (idCart, email) => {
        const date = new Date();
        const ticket = await this.dao.createTicket(idCart, email, date);
        return ticket;
    }
    getTicketsByEmail = async (email) => {
        try {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) CustomError.createError({
                name: "Email get error",
                cause: `The email that has been received is not valid, received ${email}`,
                message: "Error Getting email from the purchaser",
                code: EErrors.INVALID_TYPE_ERROR
            })
            const tickets = await this.dao.getTicketsByEmail(email);
            return tickets;

        } catch (error) {
            throw error;
        }
    }
}