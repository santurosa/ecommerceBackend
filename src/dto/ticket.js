export default class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code.toString(),
        this.purchase_datetime = ticket.purchase_datetime.trim(),
        this.amount = +ticket.amount,
        this.purchaser = ticket.purchaser.toLoweCase().trim()
    }
}