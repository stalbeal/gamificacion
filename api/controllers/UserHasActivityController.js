/**
 * UserHasActivityController
 *
 * @description :: Server-side logic for managing Userhasactivities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    create: function(req, res, next) {

        var params = req.params.all();
        Phase.count({
            concept: params.concept
        }).exec(function(err, num) {
            if (err) {
                console.log(err);
            }

            var obj = {
                user: params.user,
                activity: params.activity,
                concept: params.concept
            }

            UserHasActivity.create(obj,function recordCreated (err, uha) {
            	if(err){
            		return res.json(Response.resJson(err.status, null));
            	}
            	return res.json(Response.resJson('600', null));
            });

        });



    }

};