const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "raphaeljansson@gmail.com",
        pass: "rgjdasilva"
    },
    tls: { rejectUnauthorized: false }
});
module.exports = {

    async forgotPassword(user, token) {
        const mailOptions = {
            from: 'raphaeljansson@gmail.com',
            to: user.email,
            subject: 'Reset password triangulo!',
            html: `<h1>Hello ${user.username}</h1>
                    <p>
                    It seems someone requested a password recovery
                    for your account registered with the email ${user.email}.
                    </p>
                    
                    <p>
                    If it was you, just click this
                    <a href="https://triangulo-front-end.herokuapp.com/resetpassword/${token}/${user.email}">link</a>
                    </p>
                    
                    <p>
                    If it wasn't you then we recommend you to change your password. Someone may
                    have stolen it. 
                    </p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });
    }
}
