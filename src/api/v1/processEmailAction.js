const nodemailer = require('nodemailer');
const list = require('../../services/list');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD,
    }
});

const render = (str, userName) => {
    return str.replace(new RegExp(/USER_NAME/, "g"), userName);
};

const processItem = (item) => {
    console.log("processItem", item);
    item.status = "pending";

    const mailOptions = {
        from: process.env.GMAIL_LOGIN,
        to: item.receiver.email,
        subject: render(item.subject, item.receiver.name),
        html: render(item.html, item.receiver.name),
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

setInterval(() => {
    const item = list.getNext();
    if (!item) {
        console.log("No items");
        return;
    }
    console.log(item);
    processItem(item);
}, 10000);

module.exports = async (ctx) => {
    console.log(ctx.params);
    const item = list.find(ctx.params.id);
    if (!item) {
        console.log("No found");
        return;
    }
    if (item !== "new") {
        console.log("Not new");
        return;
    }
    processItem(item);
    ctx.body = {
        data: item,
    };
};
