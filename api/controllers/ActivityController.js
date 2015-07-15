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
            //ActivityHasPhase.find({
            //   activity: req.param('id')
            //}).populateAll().exec(function(err, phases) {
            Phase.find({
                activity: req.param('id')
            }).populateAll().exec(function(err, phases) {


                return res.view({
                    activity: req.param('id'),
                    activities: activities,
                    phases: phases
                });
            });
            //});

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
    //ya no va
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
        ActivityHasConcept.find().populateAll().exec(function(err, activitiesHasConcept) {

            var act = {};
            var aux = {};
            var conceptAux = [];
            var activityHC;
            for (var i = 0; i < activitiesHasConcept.length; i++) {
                activityHC = activitiesHasConcept[i];
                console.log(activityHC);
                if (act[activityHC.activity.id] != null) {
                    aux = act[activityHC.activity.id];
                    aux.concepts.push(activityHC.concept);
                } else {
                    conceptAux = [];
                    conceptAux.push(activityHC.concept);
                    aux = {
                        activity: activityHC.activity,
                        concepts: conceptAux
                    };
                    act[activityHC.activity.id] = aux;

                }
            }

            return res.json(Response.resJson('600', act));


        });
    }
};