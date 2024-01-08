import { Server } from "socket.io";
import { logger } from "./middlewares/logger.js";
import { productsService, usersService } from "./repositories/index.js";
import MailingService from "./service/maling/mailing.js";

const initializeSocketIO = (server) => {
    const io = new Server(server);
    let messages = [];

    io.on('connection', socket => {
        logger.info('Nuevo cliente conectado');

        socket.on('message', data => {
            messages.push(data);
            io.emit('messageLogs', messages);
        });

        socket.on('authenticated', data => {
            socket.broadcast.emit('newUserConnected', data);
        });

        socket.on('new-product', async data => {
            try {
                await productsService.createProducts(data.message);
                const products = await productsService.getProducts(10, 1);
                io.emit('products', products);
            } catch (error) {
                io.emit('error', error);
            }
        });

        socket.on('delete-product', async data => {
            try {
                const result = await productsService.deleteProduct(data.message);
                const user = await usersService.getUserByEmail(email);
                if (email != config.admin.NAME && user.role === 'user_premium') {
                    const mailer = new MailingService();
                    mailer.sendSimpleMail({
                        from: 'E-Commerce <santurosa999@gmail.com>',
                        to: email,
                        subject: 'Eliminación de producto a su nombre',
                        html: `<div>
                            <p>¡Hola! Ha sido eliminado el siguiente producto a su nombre del ecommerce:</p>
                            <div>
                                <h1>${result.title}</h1>
                                <p>Categoría: ${result.category}</p>
                                <p>${result.description}</p>
                                <p>$ ${result.price}</p>
                                <p>${result.stock} disponible(s)</p>
                            </div>
                        </div>`
                    })
                }
                const products = await productsService.getProducts(10, 1);
                io.emit('products', products);
            } catch (error) {
                io.emit('error', error.message);
            }
        });
    })
}

export default initializeSocketIO;