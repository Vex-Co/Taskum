const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

const sendEmail = (data) => {
    transporter.sendMail({
        from: `${process.env.APP_NAME} <${process.env.GMAIL_EMAIL}>`,
        to: data.email, 
        subject: data.subject, 
        text: data.text, 
    })
}

module.exports = {
    sendEmail
}