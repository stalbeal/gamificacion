/**
 * FaseController
 *
 * @description :: Server-side logic for managing Fases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    new: function(req, res, next) {
        PhaseType.find(function recordsFound(err, phaseTypes) {
            if (err) {
                next(err);
            }
            return res.view({
                phaseTypes: phaseTypes
            });
        });

    },
    create: function(req, res, next) {
        var faseObj = {
            identifier: req.param('identifier'),
            name: req.param('name'),
            startDate: req.param('startDate'),
            endDate: req.param('endDate'),
            description: ValidateFields.isNull(req.param('description')),
            phaseType: req.param('phaseType')
        }
        Phase.create(faseObj, function created(err, phase) {
            if (err)
                return next(err);
            res.redirect('/phase/show/' + phase.id);
        });
    },
    show: function(req, res, next) {
        Phase.findOne({
            id: req.param('id')
        }).populateAll().exec(function recordsFound(err, phase) {
            if (err) {
                next(err);
            }
            return res.view({
                phase: phase
            });
        });

    }

};