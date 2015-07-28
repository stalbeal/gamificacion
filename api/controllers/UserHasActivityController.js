/**
 * UserHasActivityController
 *
 * @description :: Server-side logic for managing Userhasactivities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function(req, res) {

        var params = req.params.all();
        //console.log(params);
        var objUHA = {
            user: params.loggedUser,
            activity: params.activity,
            concept: params.concept
        }
        var reply = JSON.parse(params.replies);



        UserHasActivity.create(objUHA, function recordCreated(err, uHA) {
            if (err) {
                console.log('error create uha' + err);
                return res.json(Response.resJson(err.status, null));
            }

            var objUHP = {
                phase: params.phase,
                user: params.loggedUser
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
  

}
};