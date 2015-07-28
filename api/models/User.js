/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
        key:{
            type:'string'
        },
         fullname: {//nombre completo
            type: 'string',
            required: true
        }, email: {// correo 
            type: 'string',
            required: true, 
            unique: true
        }, idNumber: {// cc 
            type: 'string',
            required: true, 
            unique: true
        }, password: {// contarseña
            type: 'string'
        }, passwordConfirmation: {// contarseña
            type: 'string'        
        }, userHasActivity:{
            collection:'UserHasActivity',
            via:'user'
        }, userHasPhase:{
            collection:'UserHasPhase',
            via:'user'
        },
        //Elimina del modelo cuando es llevado a JSON los datos que estan en delete
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj._csrf;
            delete obj.passwordConfirmation;
            delete obj.encryptedPassword;
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
                err:passwordDoesNotMatchError
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