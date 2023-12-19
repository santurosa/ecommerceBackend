import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option('-p <persistence>', 'Persistencia a utilizar', 'mongo');
program.parse();
const enviroment = program.opts().p

dotenv.config({
    path: enviroment.toUpperCase() === "FILE" ? "./.env.file" : "./.env.mongo"
});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    roleDocument: process.env.ROLE_DOCUMENT,
    mailingService: process.env.MALING_SERVICE,
    mailingUser: process.env.MAILING_USER,
    mailingPassword: process.env.MAILING_PASSWORD,
    persistence: process.env.PERSISTENCE,
    env: process.env.ENV.toLowerCase() || 'dev'
}