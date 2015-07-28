/**
 * Reply.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        userHasPhase: { //relacion con la tabla intermedia entre usuario y fase
            model: 'UserHasPhase'
        },
        answerText: {//texto de respuesta
            type: 'string'
        },
        questionId: {//id de la pregunta
            type: 'string'
        }

    }
};