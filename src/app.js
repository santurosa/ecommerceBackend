import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from 'cookie-parser';
import passport from "passport";
import compression from "express-compression";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import initializePassport from "./config/passport.js";
import config from "./config/config.js"
import __dirname from "./utils.js";
import errorHandler from './middlewares/errors.js';
import { addLogger, logger } from "./middlewares/logger.js";
import { applyPolicy } from "./middlewares/auth.js";

import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js"
import chatRouter from "./routes/messages.js";
import sessionRouter from "./routes/sessions.js";
import userRouter from "./routes/users.js";
import loggerRouter from './routes/logger.js';

const app = express();
const port = config.environment.PORT || 3000;
const urlMongo = config.environment.MONGO_URL;
const jwtSecret = config.jwt.JWT_SECRET;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(addLogger);
app.use('/static', express.static(`${__dirname}/public`))
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(session({
    store: MongoStore.create({
        mongoUrl: urlMongo,
        ttl: 3600
    }),
    secret: jwtSecret,
    resave: false,
    saveUninitialized: false
}));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion E-commerce Backend',
            description: 'API pensada para manejar un e-commerce. Proyecto final del curso Programación Backend.'
        }
    },
    apis: [`${__dirname}/docs//*.yaml`]
}

app.use('/api/docs', applyPolicy(['PUBLIC']), swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerJSDoc(swaggerOptions)));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/messages", chatRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);
app.use("/api/loggerTest", loggerRouter);
app.use(errorHandler);

const server = app.listen(port, () => {
    logger.debug("Server on PORT " + port);
})

const io = new Server(server)

let messages = [];

io.on('connection', socket => {
    logger.info('Nuevo cliente conectado');

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })
})