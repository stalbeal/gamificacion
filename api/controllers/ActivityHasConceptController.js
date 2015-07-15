/**
 * ActivityHascsConceptController
 *
 * @description :: Server-side logic for managing Activityhascsconcepts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    activityconcept: function(req, res, next) {

        ActivityHasConcept.find({
            activity: req.param('id')
        }).populateAll().exec(function(err, activities) {

            return res.json(activities);


        });
    }

};