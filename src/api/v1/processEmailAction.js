const nodemailer = require('nodemailer');
const list = require('../../services/list');

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
        to: item.to,
        subject: item.subject,
        html: item.html,
        // text: 'Your text',
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
    console.log(ctx.params);
    const item = list.find(ctx.params.id);
    processItem(item);
    ctx.body = `q: ${JSON.stringify(item)}`;
};
