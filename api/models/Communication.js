/**
* Communication.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection: ['someMongodbServer'],

  attributes: {
  	primaryNumber: 'string',
  	touches: { collection: 'touch', via: 'owner'},
  	job: {
  		collection: 'job',
  		via: 'communications'
  	}
  }
};

