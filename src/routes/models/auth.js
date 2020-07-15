Joi = require("@hapi/joi")

class AuthResponse {
    static authReturns(witch) {
        switch (witch) {
            case 500:
                return Joi.object({
                    message: Joi.string().description('Erro Interno')
                }).label('Model500');
            case 400:
                return Joi.object({
                    message: Joi.string().description('Bad Request')
                }).label('Model400')
            case 200:
                return Joi.object({
                    token: Joi.string().description('um_token_bem_grande_vira_se_tudo_certo')
                }).label('Model200')
        }
    }
    static authDesctiptions(witch) {
        switch (witch) {
            case 500:
                return 'Retorna um erro do servidor, algo não saiu como planejado'
            case 400:
                return 'Uma má requisição foi feita, todos os paramentros devem ser enviados username min 3 max 15 e senha min 3 max 8'
            case 200:
                return 'Pode comemorar por que deu tudo certo e um token foi retornado para você utilizar na api'

        }
    }
}
module.exports = AuthResponse