/**
* Touch.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection: ['someMongodbServer'], 

  attributes: {
  	type: {
  		type: 'string',
  		enum: ['sms', 'chat', 'email', 'call']
  	},
  	owner: { model: 'user' },
  	outbound: 'string',
  	inbound: 'string',
  	contact: { model: 'contact' },
  	body: 'string',
  	createdBy: { model: 'user' },
  	job: { model: 'job' }
  }
};

