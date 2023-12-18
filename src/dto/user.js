export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name.trim(),
            this.last_name = user.last_name.trim(),
            this.email = user.email.toLowerCase().trim(),
            this.age = +user.age,
            this.password = user.password.trim(),
            this.cart = user.cart,
            this.role = user.role === "admin" || user.role === "user" ||  user.role === "user_premium" ? user.role : "user"
    }
}