/**
* Document.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection: ['someMongodbServer'], 

  attributes: {
  	name: 'string',
  	pdId: 'string',
  	status: 'string',
  	job: {model: 'job', defaultsTo: null}
  }
};

