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
        return await emailRequestsRepository.findBy({ status: "approved" });
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
        await this.sendEmailWithTracking(emailRequest);
    },
    async sendEmail(emailRequest, to) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailRequest.smtpLogin,
                pass: emailRequest.smtpPassword,
            }
        });
        const mailOptions = {
            from: emailRequest.smtpLogin,
            to,
            subject: render(emailRequest.subject, emailRequest.props.name),
            html: render(emailRequest.html, emailRequest.props.name),
            // text: 'Your text',
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) {
                    console.log("err", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    async sendEmailWithTracking(emailRequest) {
        await emailRequestsRepository.update(emailRequest, { status: "in_progress" });
        await this.sendEmail(emailRequest, emailRequest.email)
            .then(() => {
                emailRequestsRepository.update(emailRequest, { status: "success" });
            })
            .catch(() => {
                emailRequestsRepository.update(emailRequest, { status: "error" });
            });
    },
};

setInterval(() => {
    emailRequestProcessor.processNext();
}, 5000);

module.exports = emailRequestProcessor;
