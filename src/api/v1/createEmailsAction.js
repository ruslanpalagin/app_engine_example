const nodemailer = require('nodemailer');
const list = require('../../services/list');

const createItem = ({to, subject, html}) => ({
    to,
    subject,
    html,
    status: "new",
    created: (new Date()).getTime(),
    attempts: 0,
});

const processItem = (item) => {
    item.status = "pending";

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mrriddick7@gmail.com',
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: 'mrriddick7@gmail.com',
        to: to,
        subject: 'Subject of your email 2',
        html: '<p>Your html here</p>',
        text: 'Your text',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            item.status = "error";
            console.log("err", err);
        } else {
            item.status = "success";
            console.log("info", info);
        }
    });

};

module.exports = async (ctx) => {
    console.log(ctx.request.body);
    const { subject, html, receivers } = ctx.request.body.data;
    list.addItems(receivers.map((to) => createItem({to, subject, html})));

    ctx.body = `q: ${JSON.stringify(list.q)}`;
};
