/**
* Company_relationships.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection: ['someMongodbServer'],
  dynamicFinders: false, 

  attributes: {
  	company:{model: 'company'},

    employee:{model: 'user'},

    companyRole: {
    	type:'string',
    	enum: ['admin', 'manager', 'technician'],
    	defaultsTo: 'technician'
	}



  }
};

