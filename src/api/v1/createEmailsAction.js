const uuidv3 = require('uuid/v3');
const nodemailer = require('nodemailer');
const list = require('../../services/list');

const createItem = ({to, subject, html}) => {
    const item = {
        id: null,
        to,
        subject,
        html,
        status: "new",
        createdAt: (new Date()).getTime(),
        attempts: 0,
    };
    item.id = uuidv3(JSON.stringify(item), uuidv3.URL);
    return item;
};


module.exports = async (ctx) => {
    console.log(ctx.request.body);
    const { subject, html, receivers } = ctx.request.body.data;
    list.addItems(receivers.map((to) => createItem({to, subject, html})));

    ctx.body = `q: ${JSON.stringify(list.q)}`;
};
