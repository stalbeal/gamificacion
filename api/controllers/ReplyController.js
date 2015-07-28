/**
 * ReplyController
 *
 * @description :: Server-side logic for managing replies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function(req, res) {

        var params = req.params.all();
        //console.log(params);

        var reply = JSON.parse(params.replies);
        //console.log(reply);
        UserHasActivity.findOne({
            activity: params.activity,
            user: params.loggedUser
        }).exec(function recordFounded(err, uHAFounded) {
            if (err) {
                console.log('error create uha' + err);
                return res.json(Response.resJson(err.status, null));
            }

            //Si el usuario no ha completado ninguna fase de la actividad
            //se crea un nuevo registro
            if (uHAFounded == null || uHAFounded == undefined) {
                var objUHA = {
                    user: params.loggedUser,
                    activity: params.activity,
                    concept: params.concept
                }
                UserHasActivity.create(objUHA, function recordCreated(err, uHA) {
                    if (err) {
                        console.log('error create uha' + err);
                        return res.json(Response.resJson(err.status, null));
                    }

                    var objUHP = {
                        phase: params.phase,
                        user: params.loggedUser,
                        userHasActivity: uHA.id
                    }
                    UserHasPhase.create(objUHP, function(err, uHP) {
                        if (err) {
                            console.log('error create uha');
                            return res.json(Response.resJson(err.status, null));
                        }
                        var replyAux;
                        var repliesResult = [];
                        for (var i = 0; i < reply.length; i++) {
                            replyAux = reply[i];
                            var replyObj = {
                                userHasPhase: uHP.id,
                                answerText: replyAux.reply,
                                questionId: replyAux.questionID
                            }
                            repliesResult.push(replyObj);


                        }

                        Reply.create(repliesResult, function recordCreated(err, replyCreated) {
                            if (err) {
                                console.log('error create reply');
                                return res.json(Response.resJson(err.status, null));
                            }
                            return res.json(Response.resJson('600', null));
                        }); //reply

                    }); //uhp
                }); //uha

            } else {

                var objUHP = {
                    phase: params.phase,
                    user: params.loggedUser,
                    userHasActivity: uHAFounded.id
                }
                UserHasPhase.create(objUHP, function(err, uHP) {
                    if (err) {
                        console.log('error create uha');
                        return res.json(Response.resJson(err.status, null));
                    }
                    var replyAux;
                    var repliesResult = [];
                    for (var i = 0; i < reply.length; i++) {
                        replyAux = reply[i];
                        var replyObj = {
                            userHasPhase: uHP.id,
                            answerText: replyAux.reply,
                            questionId: replyAux.questionID
                        }
                        repliesResult.push(replyObj);


                    }

                    Reply.create(repliesResult, function recordCreated(err, replyCreated) {
                        if (err) {
                            console.log('error create reply');
                            return res.json(Response.resJson(err.status, null));
                        }
                        return res.json(Response.resJson('600', null));
                    }); //reply

                }); //uhp


            }




        }); //finduha


    }
};