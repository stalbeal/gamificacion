/**
 * UserHasActivity.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        user: {
            model: 'User',
            required: true
        },
        activity: {
            model: 'Activity',
            required: true
        },
        concept: {
            type: 'string',
            required: true
        }/*,
        uncompletedPhases: {
            type: 'integer'
        }*/

    }
};