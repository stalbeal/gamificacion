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
            res.redirect('/activity/show/' + activity.id);
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
    activityconcept: function(req, res, next) {

        ActivityHasConcept.find({
            activity: req.param('id')
        }).populateAll().exec(function(err, activities) {
            ActivityHasPhase.find({
                activity: req.param('id')
            }).populateAll().exec(function(err, phases) {
                return res.view({
                    activity: req.param('id'),
                    activities: activities,
                    phases: phases
                });
            });

        });
    },
    addConceptNew: function(req, res) {
        Concept.find(function found(err, concepts) {
            

            res.view({
                activity: req.param('id'),
                concepts: concepts
            });
        });
    },
    addPhaseNew: function(req, res) {
        Phase.find(function found(err, phases) {
            // body...

            return res.view({
                activity: req.param('id'),
                phases: phases
            });
        });
    },
    addConcept: function(req, res, next) {
        var activityHasConcept = {
            concept: req.param('concept'),
            activity: req.param('activity')
        }
  
        ActivityHasConcept.create(activityHasConcept, function activityHasConceptCreated(err, aHC) {
            if (err)
                return next(err);



            return res.redirect('/activity/activityconcept/' + req.param('activity'));

        });


    },
    addPhase: function(req, res, next) {
        var activityHasPhase = {
            phase: req.param('phase'),
            activity: req.param('activity')
        }

        ActivityHasPhase.create(activityHasPhase, function activityHasConceptCreated(err, aHF) {
            if (err)
                return next(err);
            return res.redirect('/activity/activityconcept/' + req.param('activity'));

        });


    },
    mobileIndex: function(req, res, next) {
        Activity.find().populateAll().exec(function activitiesFounded(err, activities) {
            if (err)
                return next(err);
            var response = {
                message: 600,
                response: activities
            }
            res.json(response);
        });
    }
};