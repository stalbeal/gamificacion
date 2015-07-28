/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
module.exports = {
    /*Retorna a la vista new 
     */
    new: function(req, res, next) {
        res.view();
    },
    /*Crea un registro de un usuario
     */
    create: function(req, res, next) {

        var user = {
            fullname: req.param('fullname'),
            birthDate: ValidateFields.isNull(req.param('birthDate')),
            phoneNumber: ValidateFields.isNull(req.param('phoneNumber')),
            mobile: ValidateFields.isNull(req.param('mobile')),
            email: req.param('email'),
            username: req.param('username'),
            genre: req.param('genre'),
            address: ValidateFields.isNull(req.param('address')),
            password: req.param('password'),
            passwordConfirmation: req.param('passwordConfirmation'),
            height: ValidateFields.isNull(req.param('height')),
            weight: ValidateFields.isNull(req.param('weight')),
            description: ValidateFields.isNull(req.param('description')),
            userImage: null,
            key: req.param('key')
        }
        if (req.param('password') != null && req.param('passwordConfirmation') != null) {
            /*
             *Crea un usuario con los parametros recibidos
             */
            User.create(user, function userCreated(err, user) {
                if (err) {
                    if (err.err == null) {
                        var er = 'Alguna de la información que esta tratando de ingresar ya existe en la base de datos, por favor verifique';
                        if (sails.errorMessage(err) == er) {
                            var response = {
                                message: 'El nombre de usuario o el email ingresado ya está en uso, verifique por favor',
                                user: null
                            }
                        } else {
                            var response = {
                                message: sails.errorMessage(err),
                                user: null
                            }
                        }
                        return res.json(response);
                    } else {
                        var response = {
                            message: err.err,
                            user: null
                        }
                        return res.json(response);
                    }
                }
                /*
                 *Busca el usuario recien creado para el envio de email de bienvenida
                 */
                var idUser = user.id;
                User.findOne({
                    id: idUser
                }).populateAll().exec(function(err, userToSend) {
                    if (err) {

                        var response = {
                            message: sails.errorMessage(err),
                            user: null
                        }
                        return res.json(response);
                    }
                    /*
                     *Busca la informacion de email para el envio de email de bienvenida
                     */
                    Email.find(function emailFounded(err, email) {
                        if (err) {
                            return next(err);
                        }
                        /*
                         *Se crea un registro para el login de usuario
                         */
                        var userLogin = {
                            user: userToSend.id
                        }

                        UserLogin.create(userLogin, function userLoginCreated(err, login) {
                            if (err) {
                                var er = 'Alguna de la información que esta tratando de ingresar ya existe en la base de datos, por favor verifique';
                                if (sails.errorMessage(err) == er) {
                                    var response = {
                                        message: 'Se encuentra logueado',
                                        user: null
                                    }
                                } else {
                                    var response = {
                                        message: sails.errorMessage(err),
                                        user: null
                                    }
                                }
                                return res.json(response);
                            }


                            var em = email[0];
                            /*
                             *Se emplea el servicio SendEmail.sendInviteEmail para el envio del
                             *email de bienvenida
                             *Recibe la informacion em, del email registrado para envio de correos
                             *user.email, el correo del usuario
                             */
                            SendEmail.sendInviteEmail(em, user.email);



                            var response = {
                                message: 'Éxito',
                                user: userToSend
                            }
                            return res.json(response);

                        });


                    });
                });

            });
        } else {
            var response = {
                message: "La contraseña no puede ser nula",
                user: null
            }
            return res.json(response);
        }


    },
    /*Actualiza un usuario
     */
    update: function(req, res, next) {


        var userNew = {
            fullname: req.param('fullname'),
            birthDate: ValidateFields.isNull(req.param('birthDate')),
            phoneNumber: ValidateFields.isNull(req.param('phoneNumber')),
            genre: req.param('genre'),
            mobile: ValidateFields.isNull(req.param('mobile')),
            email: req.param('email'),
            address: ValidateFields.isNull(req.param('address')),
            height: ValidateFields.isNull(req.param('height')),
            weight: ValidateFields.isNull(req.param('weight')),
            description: ValidateFields.isNull(req.param('description'))

        }
        User.update(req.param('loggedUser'), userNew, function userUpdated(err, user) {
            if (err) {

                var response = {
                    message: sails.errorMessage(err),
                    user: null
                }
                return res.json(response);

            }

            User.findOne({
                id: req.param('loggedUser')
            }).populateAll().exec(function(err, userToSend) {

                if (err) {
                    var response = {
                        message: sails.errorMessage(err),
                        user: null
                    }
                    return res.json(response);
                }
                var response = {
                    message: 'Éxito',
                    user: userToSend
                }
                return res.json(response);
            });

        });


    },
    /*Retorna todos los usuarios existentes en la base de datos
     */
    index: function(req, res, next) {
        User.find().populateAll().exec(function(err, users) {
            if (err) {
                return next(err);
            }

            return res.view({
                users: users
            });


        });


    },
    /*Retorna a la vista show un usuario para mostrarlo
     */
    show: function(req, res, next) {
        User.findOne({
            id: req.param('id')
        }).populateAll().exec(function(err, user) {
            if (err) {

                return next(err);
            }
            if (user != undefined) {
                return res.view({
                    user: user
                });
            } else {
                var err = new Error();
                err.status = 404;

                return next(err);
            }



        });

    },
    /*Elimina un usuario existente y toda la información relacionada al mismo
     */
    destroy: function(req, res, next) {
        User.destroy(req.param('id'), function adminDestryed(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/user/index');
        });
    },
    /*Verifica la información enviada por un usuario para realizar login
     */
    login: function(req, res, next) {
        User.findOne({
            username: req.param('username')
        }).populateAll().exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                var response = {
                    message: 'El usuario no existe',
                    user: null
                }

                return res.json(response);
            } else {


                bcrypt.compare(req.param('password'), user.encryptedPassword, function passwordsMatch(err, valid) {
                    if (err)
                        return next(err);
                    if (!valid) {
                        var response = {
                            message: 'La contraseña no coincide',
                            user: null
                        }

                        return res.json(response);
                    }
                    //req.session.user = user;
                    //req.session.authenticated = true;
                    var userLogin = {
                        user: user.id
                    }




                    UserLogin.create(userLogin, function userLoginCreated(err, login) {
                        var error = "Alguna de la información que esta tratando de ingresar ya existe en la base de datos, por favor verifique";
                        if (err) {
                            var er = 'Alguna de la información que esta tratando de ingresar ya existe en la base de datos, por favor verifique';
                            if (sails.errorMessage(err) == er) {
                                var response = {
                                    message: 'Éxito',
                                    user: user
                                }
                            } else {
                                var response = {
                                    message: sails.errorMessage(err),
                                    user: null
                                }
                            }
                            return res.json(response);
                        }

                        User.update({
                            key: req.param('key')
                        }).exec(function recordUpdated(err, userUpdated) {
                            if (err) {
                                var response = {
                                    message: sails.errorMessage(err),
                                    user: null
                                }
                                return res.json(response);
                            }
                            var response = {
                                message: 'Éxito',
                                user: user
                            }
                            return res.json(response);

                        });



                    });

                });

            }
        });

    },
    /*Elimina la sesión de un usuario
     */
    destroySession: function(req, res, next) {
        //req.session.destroy();
        UserLogin.destroy({
            user: req.param('loggedUser')
        }).exec(function(err, login) {
            if (err) {
                var response = {
                    message: sails.errorMessage(err)
                }

                return res.json(response);
            }

            User.update({
                key: null
            }).exec(function recordUpdated(err, userUpdated) {
                if (err) {
                    var response = {
                        message: sails.errorMessage(err)
                    }
                    return res.json(response);
                }
                var sessionDestroyed = {
                    message: 'Éxito'
                }

                return res.json(sessionDestroyed);

            });

        });

    },
    /*Realiza las operaciones de cambio de contraseña de un usuario
     */
    passwordChange: function(req, res, next) {
        User.findOne({
            id: req.param('loggedUser')
        }).populateAll().exec(function(err, user) {
            if (err) {
                var response = {
                    message: sails.errorMessage(err)
                }
                return res.json(response);
            }
            if (!user) {
                var response = {
                    message: 'El usuario no existe'
                }

                return res.json(response);
            } else {


                bcrypt.compare(req.param('password'), user.encryptedPassword, function passwordsMatch(err, valid) {
                    if (err)
                        return next(err);
                    if (!valid) {
                        var response = {
                            message: 'La contraseña no coincide'
                        }

                        return res.json(response);
                    }


                    var password = req.param('passwordNew');
                    var passwordConfirmation = req.param('passwordConfirmation');
                    if (!password || !passwordConfirmation || password != passwordConfirmation) {
                        var response = {
                            message: 'Las contraseñas no son iguales, verifique'
                        }
                        return res.json(response);
                    }

                    require('bcrypt').hash(password, 512, function passwordEncrypted(err, encryptedPassword) {

                        var encryptedpassword = encryptedPassword;
                        var userNew = {
                            encryptedPassword: encryptedpassword
                        }

                        User.update(req.param('loggedUser'), userNew, function userUpdated(err, userResult) {
                            if (err) {
                                var response = {
                                    message: sails.errorMessage(err)
                                }
                                return res.json(response);
                            }

                            var response = {
                                message: 'Éxito'
                            }
                            return res.json(response);
                        });


                    });


                });

            }
        });


    },
    user: function(req, res, next) {
        User.find().populateAll()
            .exec(function(err, userToSend) {
                if (err) {
                    var response = {
                        message: sails.errorMessage(err)
                    }
                    return res.json(response);
                }
                return res.json(userToSend);
            });

    },
    findByEmail: function(req, res, next) {


        User.findOne({
            email: req.param('email')
        }).populateAll().exec(function(err, user) {
            if (err) {
                var response = {
                    message: sails.errorMessage(err),
                    user: null
                }
                return res.json(response);
            }
            if (!user) {
                var response = {
                    messsage: 'No existe el usuario',
                    user: null
                }
                return res.json(response);
            } else {

                /*
                 *Se crea un registro para el login de usuario
                 */
                var userLogin = {
                    user: user.id
                }
                UserLogin.create(userLogin, function userLoginCreated(err, login) {
                    if (err) {
                        var er = 'Alguna de la información que esta tratando de ingresar ya existe en la base de datos, por favor verifique';
                        if (sails.errorMessage(err) == er) {
                            var response = {
                                message: 'Se encuentra logueado',
                                user: user
                            }
                        } else {
                            var response = {
                                message: sails.errorMessage(err),
                                user: null
                            }
                        }
                        return res.json(response);
                    }

                    var response = {
                        messsage: 'Éxito',
                        user: user
                    }
                    return res.json(response);


                });
            }
        });


    },
    resetpassword: function(req, res, next) {


        User.findOne(req.param('id'), function userFound(err, user) {
            if (err) {
                return next(err);
            }

            return res.view({
                user: user
            });
        });
    },
    newPassword: function(req, res, next) {
        User.findOne({
            id: req.param('id')
        }).populateAll().exec(function(err, user) {
            if (err) {
                req.session.flash = {
                    err: sails.errorMessage(err)
                }
                return res.redirect('/user/resetpassword/' + req.param('id'));
            }
            ResetPassword.find().where({
                code: req.param('code')
            }).exec(function(err, reset) {
                if (err) {
                    req.session.flash = {
                        err: sails.errorMessage(err)
                    }
                    return res.redirect('/user/resetpassword/' + req.param('id'));
                }
                var resedId = reset.id;


                if (!user) {
                    req.session.flash = {
                        err: 'El usuario no existe'
                    }
                    return res.redirect('/user/resetpassword/' + req.param('id'));

                } else if (!reset) {
                    req.session.flash = {
                        err: 'El código ingresado es erroneo'
                    }
                    return res.redirect('/user/resetpassword/' + req.param('id'));
                } else {

                    if (req.param('username') == user.username) {

                        var password = req.param('passwordNew');
                        var passwordConfirmation = req.param('passwordConfirmation');
                        //console.log('contraseñas: '+ password+'; '+ passwordConfirmation);
                        if (!password || !passwordConfirmation || password != passwordConfirmation) {
                            req.session.flash = {
                                err: 'Las contraseñas no son iguales, verifique'
                            }
                            return res.redirect('/user/resetpassword/' + req.param('id'));
                        }

                        require('bcrypt').hash(password, 512, function passwordEncrypted(err, encryptedPassword) {

                            var encryptedpassword = encryptedPassword;
                            var userNew = {
                                encryptedPassword: encryptedpassword
                            }

                            User.update(req.param('id'), userNew, function userUpdated(err, userResult) {
                                if (err) {
                                    req.session.flash = {
                                        err: sails.errorMessage(err)
                                    }
                                    return res.redirect('/user/resetpassword/' + req.param('id'));
                                }
                                ResetPassword.destroy(resedId, function resetDestroyed(err, restDestroyed) {
                                    if (err) {
                                        return next(err);
                                    }
                                    return res.redirect('/session/success');
                                });
                            });
                        });

                    } else {
                        req.session.flash = {
                            message: 'El nombre de usuario no coincide con la cuenta asociada a su correo, verifique'
                        }
                        return res.redirect('/user/resetpassword/' + req.param('id'));
                    }
                }
            });
        });
    },
    success: function(req, res, next) {
        res.view();
    },
    userreq: function(req, res) {

        var response = {
            message: 'entre'
        }
        res.json(response);
    }

};