export default class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code.toString(),
        this.purchase_datetime = ticket.purchase_datetime.trim(),
        this.products = ticket.products,
        this.amount = +ticket.amount.toFixed(2),
        this.purchaser = ticket.purchaser.toLoweCase().trim()
    }
}