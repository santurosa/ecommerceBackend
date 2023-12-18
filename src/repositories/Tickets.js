export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao
    }
    createTicket = async (idCart, email) => {
       const ticket = await this.dao.createTicket(idCart, email);
       return ticket;
    }
}