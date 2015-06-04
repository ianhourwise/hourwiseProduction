/**
* Contact.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	connection: ['someMongodbServer'], 

  	attributes: {
  		name: 'string',
  		addresses: 'json',
  		phoneNumbers: 'json',
  		emails: 'json',
      avatarURL: 'string',
  		user: { model: 'user'},
  		groups: { collection: 'group', via: 'contacts'},
  		company: { model: 'company'},
  		createdBy: { model: 'user'},
      job: {model: 'job', defaultsTo: null}

  	}
};

