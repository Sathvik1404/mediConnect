const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "golisathu@gmail.com",
        pass: "pvyknxibideikaso",
    },
});


async function sendMail(email, subject, text) {
    console.log(text)
    const info = await transporter.sendMail({
        from: 'golisathu@gmail.com',
        to: email,
        subject,
        text,
        // html: "<b>Hello world?</b>",
    });
}
module.exports = { sendMail }