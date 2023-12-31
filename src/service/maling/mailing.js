import mailer from 'nodemailer'
import config from '../../config/config.js'
import { logger } from '../../middlewares/logger.js'

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.SERVICE,
            port: 587,
            auth: {
                user: config.mailing.USER,
                pass: config.mailing.PASSWORD
            }
        })
    }

    sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
        const result = await this.client.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        });
        logger.info(`Email successfully sent from to ${result.envelope.from} to ${result.envelope.to}`);
        return result;
    }
}