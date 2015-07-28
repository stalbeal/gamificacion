/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');
module.exports = {
	new: function (req, res, next) {
		res.view();
	
	}, create:function (req, res, next) {
		
		
        
        var admin = {
            fullname: req.param('fullname') ,
            phoneNumber: ValidateFields.isNull(req.param('phoneNumber')),
            mobile: ValidateFields.isNull(req.param('mobile')),
            email: req.param('email'),
            username: req.param('username'),
            password: req.param('password'),
            passwordConfirmation: req.param('passwordConfirmation')
        }
        Admin.create(admin,function adminCreated (err, admin) {
        	if (err) {
                var er='Alguna de la información que esta tratando de ingresar ya existe en la base de datos, por favor verifique';
                if(sails.errorMessage(err)==er){
                        req.session.flash = {
                        err: 'El nombre de usuario o el email ingresado ya está en uso, verifique por favor'
                    }
                    }else{
                    req.session.flash = {
                    err:  sails.errorMessage(err)
                }
                }
                
            }
            return res.redirect('/admin/show/'+admin.id);
        });
	}, edit: function (req, res, next) {
		Admin.findOne(req.param('id'), function adminFounded (err, admin) {
			if(err){ return next(err);}
			return res.view({
				admin:admin
			});
		});
	}, update: function (req, res, next) {
		
        
        var adminNew = {
            fullname: req.param('fullname') ,
            phoneNumber: ValidateFields.isNull(req.param('phoneNumber')),
            mobile: ValidateFields.isNull(req.param('mobile')),
            email: req.param('email')
        }
        Admin.update(req.param('id'), adminNew, function adminUpdated (err, admin) {
        	 if (err) {
        	 	req.session.flash = {
                    err:  sails.errorMessage(err)
                }
               
               }
                
              return res.redirect('/admin/show/'+req.param('id'));
        });
	

	
    }, index: function(req, res, next) {
        Admin.find(function adminsFounded(err, admins) {
            if (err) {

                return next(err);
            }
            
                if (req.wantsJSON) {
                	return res.json(admins);
            	}else{
	                return res.view({
	                    admins: admins
	                });
               }
        });
    }, show: function (req, res, next) {
    	Admin.findOne(req.param('id'), function adminFounded(err, admin) {
            if (err) {
                return next(err);
            }
            
               
                 if(admin!=undefined){
                 return res.view({
                    admin: admin
                });
            }else{
                var err = new Error();
                  err.status = 404;
                  
                return next(err);
            }
               
        });
   
    },destroy:function (req, res, next) {
		Admin.destroy(req.param('id'), function adminDestryed (err) {
				if(err){return next(err);}
				return res.redirect('/admin/index');
			});
	}, login: function (req, res, next) {
		Admin.findOneByUsername(req.param('username'), function adminFounded(err, admin) {
            if (err) {
                return next(err);
            }
            if (!admin) {
                var errNotExist = {
                    message: 'El usuario no existe'
                }
                
                return res.json(errNotExist);
            }else{


            bcrypt.compare(req.param('password'),admin.encryptedPassword, function passwordsMatch(err, valid) {
                if (err)
                    return next(err);
                if (!valid) {
                    var passwordError = {
                        message: 'La contraseña no coincide'
                    }
                    
                    return res.json(passwordError);
                }
                
                return res.json(admin);


            });

        }
        });

}, passwordnew: function (req, res, next) {
    Admin.findOne(req.param('id'), function adminFounded (err, admin) {
       if (err) {return next(err);}

       return res.view({
        admin:admin
       });
    });

}, passwordchange: function(req, res, next) {
        Admin.findOne({
            id: req.param('id')
        })
            .populateAll().exec(function (err, user) {
               if (err) {
                    req.session.flash = {
                        err:  sails.errorMessage(err)
                    }
                    return res.redirect('/admin/passwordchange/'+req.param('id'));
                }
                if (!user) {
                    req.session.flash = {
                            err:  'El usuario no existe'
                        }
                        return res.redirect('/admin/passwordchange/'+req.param('id'));
                } else {


                    bcrypt.compare(req.param('password'), user.encryptedPassword, function passwordsMatch(err, valid) {
                        if (err)
                            return next(err);
                        if (!valid) {
                            
                            req.session.flash = {
                                err:  'La contraseña ingresada es incorrecta'
                            }
                            return res.redirect('/admin/passwordchange/'+req.param('id'));
                        }


                        var password = req.param('passwordNew');
                        var passwordConfirmation = req.param('passwordConfirmation');
                        //console.log('contraseñas: '+ password+'; '+ passwordConfirmation);
                        if (!password || !passwordConfirmation || password != passwordConfirmation) {
                            if (err) {
                                    req.session.flash = {
                                        err:  'Las contraseñas no son iguales, verifique'
                                    }
                                    return res.redirect('/admin/passwordchange/'+req.param('id'));
                                }
                        }

                        require('bcrypt').hash(password, 512, function passwordEncrypted(err, encryptedPassword) {

                            var encryptedpassword = encryptedPassword;
                            var userNew = {
                                encryptedPassword: encryptedpassword
                            }

                        Admin.update(req.param('id'), userNew, function userUpdated(err, userResult) {
                                if (err) {
                                    req.session.flash = {
                                        err:  sails.errorMessage(err)
                                    }
                                    return res.redirect('/admin/passwordchange/'+req.param('id'));
                                }
                            
                                return res.redirect('/admin/show/'+req.param('id'));
                            });

                            
                        });


                    });

                }
            });

    },
    restorepassword: function(req, res, next) {


        Admin.findOne(req.param('id'), function userFound(err, admin) {
            if (err) {
                return next(err);
            }

            return res.view({

                admin: admin

            });
        });
    },
    resetpassword: function(req, res, next) {
        Admin.findOne({
            id: req.param('id')
        }).populateAll().exec(function(err, admin) {
            if (err) {
                req.session.flash = {
                    err: sails.errorMessage(err)
                }
                return res.redirect('/admin/restorepassword/' + req.param('id'));
            }
            ResetPassword.find().where({
                code: req.param('code')
            }).exec(function(err, reset) {
                if (err) {
                    req.session.flash = {
                        err: sails.errorMessage(err)
                    }
                    return res.redirect('/admin/restorepassword/' + req.param('id'));
                }
                var resedId = reset.id;


                if (!admin) {
                    req.session.flash = {
                        err: 'El usuario no existe'
                    }
                    return res.redirect('/admin/restorepassword/' + req.param('id'));

                } else if (!reset) {
                    req.session.flash = {
                        err: 'El código ingresado es erroneo'
                    }
                    return res.redirect('/admin/restorepassword/' + req.param('id'));
                } else {

                    if (req.param('username') == admin.username) {

                        var password = req.param('passwordNew');
                        var passwordConfirmation = req.param('passwordConfirmation');
                        //console.log('contraseñas: '+ password+'; '+ passwordConfirmation);
                        if (!password || !passwordConfirmation || password != passwordConfirmation) {
                            req.session.flash = {
                                err: 'Las contraseñas no son iguales, verifique'
                            }
                            return res.redirect('/admin/restorepassword/' + req.param('id'));
                        }

                        require('bcrypt').hash(password, 512, function passwordEncrypted(err, encryptedPassword) {

                            var encryptedpassword = encryptedPassword;
                            var adminNew = {
                                encryptedPassword: encryptedpassword
                            }

                            Admin.update(req.param('id'), adminNew, function userUpdated(err, userResult) {
                                if (err) {
                                    req.session.flash = {
                                        err: sails.errorMessage(err)
                                    }
                                    return res.redirect('/admin/restorepassword/' + req.param('id'));
                                }
                                ResetPassword.destroy(resedId, function resetDestroyed(err, restDestroyed) {
                                    if (err) {
                                        return next(err);
                                    }
                                    return res.redirect('/session/login');
                                });
                            });
                        });

                    } else {
                        req.session.flash = {
                            message: 'El nombre de usuario no coincide con la cuenta asociada a su correo, verifique'
                        }
                        return res.redirect('/admin/restorepassword/' + req.param('id'));
                    }
                }
            });
        });
    }
       
    
};
