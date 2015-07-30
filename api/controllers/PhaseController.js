/**
 * FaseController
 *
 * @description :: Server-side logic for managing Fases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    new: function(req, res, next) {
        var params = req.param('id').split(';');
        console.log(params);
       

            Concept.findOne({
                id: params[0]
            }).exec(function(err, concept) {
                if (err) {
                    next(err);
                }

                if (Response.view(concept, next)) {
                    return res.view({
                        concept: concept,
                        activity: params[1]

                    });
                }
           
        });

    },
    create: function(req, res, next) {
        var faseObj = {
            identifier: req.param('identifier'),
            name: req.param('name'),
            startDate: req.param('startDate'),
            endDate: req.param('endDate'),
            description: ValidateFields.isNull(req.param('description')),
            phaseType: req.param('phaseType'),
            concept: req.param('concept'),
            activity: req.param('activity')
        }
        Phase.create(faseObj, function created(err, phase) {
            if (err)
                return next(err);


            /* var activityHasPhase = {
                phase: phase.id,
                activity: req.param('activity')
            }

            ActivityHasPhase.create(activityHasPhase, function activityHasConceptCreated(err, aHF) {
                if (err)
                    return next(err);*/
            return res.redirect('/phase/show/' + phase.id);

            //});

        });
    },
    show: function(req, res, next) {
        Phase.findOne({
            id: req.param('id')
        }).populateAll().exec(function recordsFound(err, phase) {

            Question.find({
                phase: req.param('id')
            }).exec(function(err, questions) {
                if (err) {
                    next(err);
                }
                console.log(phase);
                return res.view({
                    phase: phase,
                    questions: questions
                });

            });
        });

    },
    getPhasesActivity: function(req, res) {
        var params = req.params.all();
        Phase.find({
            activity: params.activity,
            concept: params.concept
        }).populateAll().exec(function(err, phases){
            if(err){
                return res.json(Response.resJson(err.status, null));
            }
           /* var phaseAux;
             var phaseAux2;
            for(var i=0; i<phases.length;i++){
                phaseAux=phases[i];
                if(phaseAux.phaseType=="2"){
                    Reply.find({phase:phaseAux.id}).exec(function (err, replys) {
                         for(var j=0; j<phases.length;j++){

                            phaseAux2=phases[i];
                             if(phaseAux2.phaseType=="3"){
                        phaseAux2.question.push(replys);
                    }
                    }
                    });
                }
            }*/

            return res.json(Response.resJson('600', phaseAux));
        });
    }

};