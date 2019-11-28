// const knex = require('../instances/knex');
const nodemailer = require('nodemailer');
const emailRequestsRepository = require('../repositories/emailRequestsRepository');

const render = (str, userName) => {
    return str.replace(new RegExp(/USER_NAME/, "g"), userName);
};

const emailRequestProcessor = {
    isActive: false,
    on() {
        this.isActive = true;
    },
    off() {
        this.isActive = false;
    },
    async getNextApproved() {
        return await emailRequestsRepository.findBy({ status: "new" });
    },
    async processNext() {
        if (!this.isActive) {
            console.log("Off: skipping");
        }
        const emailRequest = await this.getNextApproved();
        if (!emailRequest) {
            console.log("Next not found. Skipping");
            return;
        }
        console.log("next", emailRequest);
        await this.sendEmail(emailRequest);
    },
    async sendEmail(emailRequest) {
        await emailRequestsRepository.update(emailRequest, { status: "in_progress" });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailRequest.smtpLogin,
                pass: emailRequest.smtpPassword,
            }
        });
        const mailOptions = {
            from: emailRequest.smtpLogin,
            to: emailRequest.email,
            subject: render(emailRequest.subject, emailRequest.props.name),
            html: render(emailRequest.html, emailRequest.props.name),
            // text: 'Your text',
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                emailRequestsRepository.update(emailRequest, { status: "error" });
                console.log("err", err);
            } else {
                emailRequestsRepository.update(emailRequest, { status: "success" });
            }
        });
    },
};

setInterval(() => {
    emailRequestProcessor.processNext();
}, 5000);

module.exports = emailRequestProcessor;
