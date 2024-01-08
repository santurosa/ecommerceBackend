import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option('-p <persistence>', 'Persistencia a utilizar', 'mongo');
program.parse();
const enviroment = program.opts().p

dotenv.config({
    path: enviroment.toUpperCase() === "FILE" ? "./.env.file" : "./.env"
});

export default {
    environment: {
        PORT: process.env.PORT,
        MONGO_URL: process.env.MONGO_URL,
        PERSISTENCE: process.env.PERSISTENCE,
        ENV: process.env.ENV.toLowerCase() || 'dev',
    },
    admin: {
        NAME: process.env.ADMIN_NAME,
        PASSWORD: process.env.ADMIN_PASSWORD,
    },
    jwt: {
        JWT_SECRET: process.env.JWT_SECRET,
    },
    mailing: {
        SERVICE: process.env.MALING_SERVICE,
        USER: process.env.MAILING_USER,
        PASSWORD: process.env.MAILING_PASSWORD,
    },
    github: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        CALLBACK_URL: process.env.CALLBACK_URL,
    }
}