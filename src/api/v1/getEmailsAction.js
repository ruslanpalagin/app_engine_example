const nodemailer = require('nodemailer');
const list = require('../../services/list');

module.exports = async (ctx) => {
    ctx.body = `q: ${JSON.stringify(list.q)}`;
};
