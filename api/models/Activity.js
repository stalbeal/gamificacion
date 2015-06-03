/**
 * Activity.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    attributes: {
        idNumber: {
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
        activityHasFase: {
            collection: 'ActivityHasFase',
            via: 'activity'
        },
        activityHasConcept: {
            collection: 'ActivityHasConcept',
            via:'activity'
        }
    }
};