/**
 * ConceptController
 *
 * @description :: Server-side logic for managing Concepts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    new: function(req, res) {
        res.view();
    },
    create: function(req, res) {
        var concept = {
            name: req.param('name'),
            description: req.param('description')
        }
        Concept.create(concept, function activityCreated(err, concept) {
            if (err)
                return next(err);
            res.redirect('/concept/show?id=' + concept.id);
        });
    },
    show: function(req, res) {
        Concept.findOne(req.param('id'), function activityFounded(err, concept) {
            if (err)
                return next(err);
            res.view({
                concept: concept
            });
        })
    },index:function(req, res, next) {
        Concept.find(function recordsFounded(err, concepts) {
            return res.view({
                concepts:concepts
            });
        })
    }
};