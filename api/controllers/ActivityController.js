/**
 * ActivityController
 *
 * @description :: Server-side logic for managing Activities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
    new: function(req, res) {
        res.view();
    },
    create: function(req, res) {
        var activity = {
            idNumber: req.param('idNumber'),
            name: req.param('name'),
            startDate: req.param('startDate'),
            endDate: req.param('endDate'),
            description: req.param('description')
        }
        Activity.create(activity, function activityCreated(err, activity) {
            if (err)
                return next(err);
            res.redirect('/activity/show?id=' + activity.id);
        });
    },
    show: function(req, res) {
        Activity.findOne(req.param('id')).populateAll().exec(function activityFounded(err, activity) {
            if (err)
                return next(err);
            res.view({
                activity: activity
            });
        })
    },
    addConceptNew: function(req, res) {
        res.view({activity: req.param('activity')});
    },
    addConcept: function(req, res, next) {
        var activityHasConcept = {
            concept: req.param('concept'),
            activity: req.param('activity')
        }
        ActivityHasConcept.create(activityHasConcept, function activityHasConceptCreated(err, aHC) {
            if (err)
                return next(err);
            console.log('actividad : ' + JSON.stringify(aHC));

            Activity.findOne(aHC.activity, function activityFounded(err, activity) {
                if (err)
                    return next(err);

                res.redirect('/activity/show?id=' + activity.id);
            })
        });


    }, mobileIndex: function  (req, res, next) {
        Activity.find().populateAll().exec(function activitiesFounded (err, activities) {
            if(err)
                return next(err);
            var response= {
                message: 600,
                response:activities
            }
            res.json(response);
        });
    }
};