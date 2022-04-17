const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'taskum.vex@gmail.com',
        pass: `frqqrjgtibagepwc`, // can't login with that password
    },
});

const sendEmail = (data) => {
    transporter.sendMail({
        from: 'Vex <taskum.vex@gmail.com>',
        to: data.email, 
        subject: data.subject, 
        text: data.text, 
    })
}

module.exports = {
    sendEmail
}