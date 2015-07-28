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
            email: req.param('email'),
            idNumber: req.param('idNumber'),
            password: req.param('password'),
            passwordConfirmation: req.param('passwordConfirmation')

        }
        if (req.param('password') != null && req.param('passwordConfirmation') != null) {
            /*
             *Crea un usuario con los parametros recibidos
             */
            User.create(user, function userCreated(err, user) {
                if (err) {
                    return res.json(Response.resJson(err.status, null));
                }
                /*
                 *Busca el usuario recien creado para el envio de email de bienvenida
                 */
                var idUser = user.id;
                User.findOne({
                    id: idUser
                }).populateAll().exec(function(err, userToSend) {
                    if (err) {
                        return res.json(Response.resJson(err.status, null));
                    }

                    /*
                     *Se crea un registro para el login de usuario
                     */
                    var userLogin = {
                        user: userToSend.id
                    }

                    UserLogin.create(userLogin, function userLoginCreated(err, login) {
                        if (err) {
                            return res.json(Response.resJson(err.status, null));
                        }


                        return res.json(Response.resJson('600', userToSend));

                    });

                });

            });
        } else {
            return res.json(Response.resJson('602', null));
        }


    },
    /*Actualiza un usuario
     */
    update: function(req, res, next) {



        var user = {
            fullname: req.param('fullname'),
            email: req.param('email')

        }
        User.update(req.param('loggedUser'), userNew, function userUpdated(err, user) {
            if (err) {
                return res.json(Response.resJson(err.status, null));

            }

            User.findOne({
                id: req.param('loggedUser')
            }).populateAll().exec(function(err, userToSend) {

                if (err) {
                    return res.json(Response.resJson(err.status, null));
                }
                return res.json(Response.resJson('600', userToSend));
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
            idNumber: req.param('idNumber')
        }).populateAll().exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json(Response.resJson('601', null));
            } else {
                bcrypt.compare(req.param('password'), user.encryptedPassword, function passwordsMatch(err, valid) {
                    if (err)
                        return next(err);
                    if (!valid) {
                        return res.json(Response.resJson('602', null));
                    }
                    //req.session.user = user;
                    //req.session.authenticated = true;
                    var userLogin = {
                        user: user.id
                    }
                    console.log(user);

                    UserLogin.create(userLogin, function userLoginCreated(err, login) {
                        if (err) {
                            console.log(err);
                            //return res.json(Response.resJson(err.status, null));
                        }

                        /*  User.update({
                            key: req.param('key')
                        }).exec(function recordUpdated(err, userUpdated) {
                            if (err) {
                                var response = {
                                    message: sails.errorMessage(err),
                                    user: null
                                }
                                return res.json(response);
                            }*/
                        return res.json(Response.resJson('600', user));

                        //});
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
                return res.json(Response.resJson(err.status, null));
            }
            /* User.update({
                key: null
            }).exec(function recordUpdated(err, userUpdated) {
                if (err) {
                    var response = {
                        message: sails.errorMessage(err)
                    }
                    return res.json(response);
                }*/
            return res.json(Response.resJson('600', null));

            //});

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
                return res.json(Response.resJson('601', null));
            } else {


                bcrypt.compare(req.param('password'), user.encryptedPassword, function passwordsMatch(err, valid) {
                    if (err)
                        return next(err);
                    if (!valid) {
                        return res.json(Response.resJson('602', null));
                    }


                    var password = req.param('passwordNew');
                    var passwordConfirmation = req.param('passwordConfirmation');
                    if (!password || !passwordConfirmation || password != passwordConfirmation) {
                        return res.json(Response.resJson('602', null));
                    }

                    require('bcrypt').hash(password, 512, function passwordEncrypted(err, encryptedPassword) {

                        var encryptedpassword = encryptedPassword;
                        var userNew = {
                            encryptedPassword: encryptedpassword
                        }

                        User.update(req.param('loggedUser'), userNew, function userUpdated(err, userResult) {
                            if (err) {
                                return res.json(Response.resJson(err.status, null));
                            }

                            return res.json(Response.resJson('600', null));
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
                    return res.json(Response.resJson(err.status, null));
                }
                 return res.json(Response.resJson('600', userToSend));
            });

    },
    findByEmail: function(req, res, next) {


        User.findOne({
            email: req.param('email')
        }).populateAll().exec(function(err, user) {
            if (err) {
                 return res.json(Response.resJson(err.status, null));
            }
            if (!user) {
                 return res.json(Response.resJson('605', null));
            } else {

                /*
                 *Se crea un registro para el login de usuario
                 */
                var userLogin = {
                    user: user.id
                }
                UserLogin.create(userLogin, function userLoginCreated(err, login) {
                    if (err) {
                         return res.json(Response.resJson(err.status, null));
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
    }

};