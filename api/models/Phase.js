/**
 * Phase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

    	identifier: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        startDate: {
            type: 'string',
            required: true
        },
        endDate: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string'
        },
        activityHasPhase: {
            collection: 'ActivityHasPhase',
            via: 'phase'
        },phaseType:{
        	model:'PhaseType'
        }, phaseHasQuestion:{
           collection:'PhaseHasQuestion',
           via:'phase'
        },concept:{
            model:'Concept'
        }


    }
};