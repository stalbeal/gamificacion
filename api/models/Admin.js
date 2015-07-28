/**
* Admin.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		fullname: {//nombre completa
            type: 'string',
            required: true
        
        }, phoneNumber: { //teléfono
            type: 'string'
        }, mobile: { //teléfono
            type: 'string'
        }, email: {// correo 
            type: 'string',
            required: true, 
            unique: true
        }, username: {// usuario 
            type: 'string',
            required: true, 
            unique: true
        }, password: {// contarseña
            type: 'string',
            required: true
        }, passwordConfirmation: {// contarseña
            type: 'string',
            required: true
        }, encryptedPassword: {// contraseña encriptada
            type: 'string'
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj._csrf;
            delete obj.passwordConfirmation;
            delete obj.encryptedPassword;
            delete obj.admin;
            return obj;
        
        }
    },
    //metodo antes de crear el user con el cual se comparan las contraseñas ingresadas,
    //y se verifican que sean iguales y se procede a encriptar, recibe un objeto de tipo usuario
    beforeCreate: function(values, next) {
        var password = values.password;
        var passwordConfirmation = values.passwordConfirmation;
        //console.log('contraseñas: '+ password+'; '+ passwordConfirmation);
        if (!password || !passwordConfirmation || password != passwordConfirmation) {
            var passwordDoesNotMatchError = {

                message: 'Las Contraseñas no son iguales, verifique'
            }
            return next({
                err: passwordDoesNotMatchError
            });
        }

        require('bcrypt').hash(values.password, 512, function passwordEncrypted(err, encryptedPassword) {
            values.password=null;
            values.passwordConfirmation=null;
            values.encryptedPassword = encryptedPassword;
            
            next();
        });
    }
  
};

