/**
* Job.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: ['someMongodbServer'], 
  attributes: {
  	company:{model: 'company'},
  	creator: {model: 'user'},
    owner:{model: 'user'},

  	name: 'string',
  	number: {type: 'string', defaultsTo:''},
  	description:{type: 'string', defaultsTo: ''},

  	amount:  {
  		type: 'float',
  		defaultsTo: '0.0',
  	},

  	//products: {collection: 'products', via: 'product'}
  	desiredMargin:'float',
  	startDate: 'date',
  	endDate: 'date',

	//controls work flow and permissions
	state: {type: 'string', enum: ['unlocked', 'locked'], defaultsTo: 'unlocked'},
	status: {type: 'string', enum: ['open', 'won', 'lost', 'canceled', 'deleted', 'pending'], defaultsTo: 'open'},
	//controls primary stage of business
	stage: {type: 'string', enum: ['lead','working', 'closing', 'closed', 'paused'], defaultsTo: 'lead'},
	//phase: {type: 'string', enum: ['initialPhoneCall', 'apptSet','etc']},
  	milestone: {
  		type: 'string',
  		//will have to think through each stage and may not dictate...
  		// enum: ['new', 'set', 'estimated', 'viewed', 'production', 'completed'],
  		defaultsTo: "New"
  	},
	isOverdue: {type: 'boolean', defaultsTo: false},
	pctOverdue: {type: 'float', defaultsTo: 0.00},
  tasks: { collection: 'task', via: 'job'},
  processes: 'json',  	 

	//sync: {integration: "nutshell", integrationId: {field: "number", identifier: "1234"}, syncedOn: dateTime}
	sync: 'json',

	//notes: {{author: 'username', date: 'date/written', note: 'detail', edit:{by: 'jon', delta:'old', date:''}},{}}
	notes: 'json',

    from: {	model: 'User' },
  	to: {model: 'User'},

  	industry: {
  		type: 'string',
  		//defaultsTo: this.company.primaryIndustry
  	},

  	source:  {
  		type: 'string',
  		defaultsTo: '',
  		required: true
  	},

    expectation: {
      type: 'string',
      enum: ['1', '2', '3', '4', '5'],
      defaultsTo: '3'
    },

    //touches: {lastTouch: date, counts: {email: 1, phone: 5, sms: 10}, history: {{type: "email", date: 1/1/15, who: 'user'}, {type: "sms", date: 1/2/15}}
    touches: 'json',
    address: 'json',

    documents: {
      collection: 'document',
      via: 'job'
    },
	// address: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },
 //  	address2: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },
 //  	city: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },
 //  	state: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },
 //  	zipCode: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },
 //    email: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },
 //    phoneNumber: {
 //      type: 'string',
 //      defaultsTo: ''
 //    },

    hottness: {
    	type: "integer",
    	enum: ["1","2", "3", "4", "5"],
    	defaultsTo: "3"
    },

	//transactions: {collection: 'transactions', via: 'job'},
  	//primaryContact: {model: 'contact'},
  	//contacts: {collection: 'contact', via: 'job'},
  	//Have to think through this some...look at the rails example of followers, from a while back. 
  	//parentJob: {model: 'job'}
  	//subJobs: {collection: 'job', via: 'job'}

  }
};

