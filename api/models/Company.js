/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // schema: true,
  connection: ['someMongodbServer'],
  dynamicFinders: false, 	


  attributes: {
  	name  : { type: 'string', defaultsTo: 'Company Name'},
    owner : { model: 'user'},

    type: {
    	type: 'string',
    	enum: ['provider', 'vendor'],
    	defaultsTo: 'provider'
    },

    primaryIndustry: {
    	type: 'string',
    	defaultsTo: 'Primary Industry'
    },

    employees: {
    	collection: 'user',
    	via: 'company'
    },

    accountSettings: {

        type: 'json',
        defaultsTo: {plan: 'Pro'}
    },

    contactInfo: {
        type: 'json',
        defaultsTo: {}
    },

    skills: 'string',

    hours: 'string',

    notes: 'string',

    groups: {
        collection: 'group',
        via: 'company'
    },

    contacts: {
        collection: 'contact',
        via: 'company'
    },

    productsAndServices: {type: 'array', defaultsTo: []}


    // employeeRelationships : {
    //         collection: 'companyrelationship',
    //         via: 'company'
    // },

// Unfortunately this won't work, but could probably do something like this in the controller. 
    // employees: function(){
    // 	var ids = [];
    // 	var employees = [];
    // 	for (var rel in this.employeeRelationships){
    // 		ids.push(rel.employee);
    // 	}
    // 	console.log('ER looks like:' + this.populate('employeeRelationships'));
    // 	console.log('name looks like:' + this.name);
    // 	console.log('ids are: '+ ids);
    // 	for (var id in ids){
    // 		User.find({id: id}, function(err, user){
    // 			employees.push(user);
    // 		});
    // 	}

    // 	return employees;

    // }

  }

};

