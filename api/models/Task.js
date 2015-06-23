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
  	startDate: 'date',
  	dueDate: 'date',
    reminderDate: 'date',
    completedOn: 'date',
    timeLog: 'array',
    zendeskId: 'string',
    urgent: "boolean",
  	zendesk: 'json',
  	owner: { model: 'user' },
  	requester: { model: 'user' },
    job: { model: 'job', defaultsTo: null},
    type: 'string',
    notes: 'json',
    attachments: 'array',
    job: { model: 'job' },
    createdAtOriginal: 'date'
  }
};

