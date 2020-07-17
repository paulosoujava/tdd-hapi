const nodemailer = require("nodemailer")
class SendEmail {

    static header() {
        return nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT_EMAIL,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.NAME_GMAIL, // generated ethereal user
                pass: process.env.PASSWORD_GMAIL, // generated ethereal password
            },
        })
    }
}

module.exports = SendEmail