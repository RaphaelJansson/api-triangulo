const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const path = require('path');


var options = {
    viewEngine: handlebars.create({
        partialsDir: 'partials/',
        defaultLayout: false
    }),
    viewPath: path.resolve(__dirname, '../views')
}

const transporter = nodemailer.createTransport({
    service: "hotmail", // hostname
    auth: {
        user: "orders@triangulo.com.br",
        pass: "*%TppOrd*"
    },
});

transporter.use('compile', hbs(options));
module.exports = {

    async forgotPassword(user, token) {
        let mailOptions = {
            from: 'orders@triangulo.com.br',
            to: user.email,
            subject: 'Reset password triângulo!',
            template: 'template',
            context: {
                title: 'Reset password Triângulo!',
                user: ` Hello ${user.username},`,
                image: `./CapturaPreta.png`,
                body1: `It seems someone requested a password recovery<br>
                for your account registered with the email ${user.email}<br>`,
                body2: `If it was you, just `,
                link: `https://triangulo-front-end.herokuapp.com/resetpassword/${token}/${user.email}`,
                body3: `If it wasn't you then we recommend you to change your password. Someone may have stolen it.`
            }
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });
    },
    
}
