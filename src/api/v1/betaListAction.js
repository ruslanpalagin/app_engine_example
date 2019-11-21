const nodemailer = require('nodemailer');

module.exports = async (ctx) => {
    console.log(ctx.request.body);


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mrriddick7@gmail.com',
            pass: ''
        }
    });

    const mailOptions = {
        from: 'mrriddick7@gmail.com', // sender address
        to: 'ruslan.palagin.ck@gmail.com', // list of receivers
        subject: 'Subject of your email', // Subject line
        html: '<p>Your html here</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            console.log(err)
        else
            console.log(info);
    });

    ctx.body = `v5: ${JSON.stringify(ctx.request.body)}`;
};
