/**
 * QuestionController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    new: function(req, res, next) {

        Phase.findOne({
            id: req.param('id')
        }).exec(function(err, phase) {
            if (Response.view(phase, next)) {
                return res.view({
                    phase: phase
                });
            }
        });
    },
    /*Crea una nueva clase
     */
    create: function(req, res, next) {

        var questionObj = {
            statement: req.param('statement'),
            description: ValidateFields.isNull(req.param('description')),
            phase: req.param('phase')
        }

        Question.create(questionObj, function recordCreated(err, question) {
            if (err) {
                req.session.flash = {
                    err: sails.errorMessage(err)
                }
                return res.redirect('/question/new/' + req.param('phase'));
            }
            if (Response.view(question, next)) {

                return res.redirect('/question/show/' + question.id);

            }
        });

    },
    /*Retorna a la vista show
     */
    show: function(req, res, next) {
        Question.findOne({
            id: req.param('id')
        }).populateAll().exec(function(err, question) {

            if (Response.view(question, next)) {
                return res.view({
                    question: question
                });
            }
        });
    }

};