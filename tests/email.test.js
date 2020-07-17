const assert = require('assert'),
    nodemailer = require("nodemailer"),
    sendEmail = require('./../src/helpers/sendEmail')


describe('Suite de teste com email', function() {

    it('Enviar um email', async() => {
        let transporter = sendEmail.header()
        let message = {
            from: 'Paulo <paulosoujava@gmail.com>',
            to: 'Paulo Jorge <paulosoujava@gmail.com>',
            subject: 'Pedido de nova senha ✔',
            text: 'Texto da nova senha com o link ',
            html: '<p><b>Showw</b> não cotavão com minha astucia</p>' +
                '<p>Clica ai e vamos lá resetar a \'mardita\' senha<br/><img src="https://steemitimages.com/p/S5Eokt4BcQdk2bRb9gatmwEsdvNEZvoQhYhUYRfCvWBnVEYzcA4Uvz5139g1GRPbxRDpZvE?format=match&mode=fit&width=640"/></p>'
        }
        let info = await transporter.sendMail(message);
        console.log('Message sent successfully as %s', info.messageId);
        assert.ok(info.messageId !== '')

    })
})