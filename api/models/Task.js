/**
* Task.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection: ['someMongodbServer'], 

  attributes: {
  	name: 'string',
  	description: 'string',
    status: 'string',
    category: 'string',
  	startDate: 'datetime',
  	dueDate: 'datetime',
    reminderDate: 'datetime',
    completedOn: 'datetime',
    timeLog: 'array',
    zendeskId: 'string',
  	zendesk: 'json',
  	owner: { model: 'user' },
  	requester: { model: 'user' },
    type: 'string',
    notes: 'json',
    attachments: 'array'
  }
};

