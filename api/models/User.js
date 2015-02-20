var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  // connection: ['someMongodbServer'], 

  attributes: {
    username  : { type: 'string', defaultsTo: ''},
    email     : { type: 'email',  unique: true, required: true },
    passports : { collection: 'Passport', via: 'user' },

    role: {
    	type: 'string',
    	enum: ['super_admin', 'admin', 'concierge', 'user'],
    	defaultsTo: 'user'
    },

    //For company owner's
    myCompany : { model: 'company'},

    //For employees:
    company: {model: 'company'},
    //Going to store company settings here for now, even though it's probably better to do in a relationship table...security issues?
    //{role: "admin", paymentInfo: {bank:"Chase", acctno: "sdfsdf"}, addres:{}, etc:{}}
    companySettings: {
    	type: 'json',
    	// defaultsTo: {role: 'manager', type: 'w2'}
    },
    // companyRelationship: {model: 'companyrelationship'},

    jobs: {collection: 'job', via: 'owner'},


    salesGoal: 'float',
    //stores user metrics
    //{nutshell: {key:'', password: '', id: '', synced: 'datetime', metrics: [], etc:{}}}
    integrations: 'json',
    //put into integrations
	//NutshellAPI
	nutshellAPI_Key: 'string',
	nutshellAPI_Password: 'string',
	//Nutshell UserId
  	nutshellId: 'integer',
  	performanceMetrics: 'json',
  	redLeads: 'json', 

    // company: {model: 'company'},
    // jobs: {
    // 	collection: "job",
    // 	via: "owner"
    // },

    // leads:{
    //   collection: "Lead",
    //   via: 'to'
    // },

    // referrals: {
    //   collection: "Lead",
    //   via: "from"

    // },



  // nutshellId: function() {
  //   if (!this.nutshellAPI_Key || !this.nutshellAPI_Password) return null ;
  //   id='Try to Refresh';
  //   NutshellApi.getNutshellId("jon@hourwise.com","22b17e8532cef15c2dc2a4579caf94498c1d0324", 'Jon Hill', function(res){
  //     id= res;
  //   })
  //   return id
  // },


  // getPerformanceMetrics: function(user){
  //   NutshellApi.getPerformanceReports(user, function(err, response){
  //     this.performanceMetrics = response;
  //     this.save();
  //   }.bind(this));
  // },

  // getRedLeads: function(user){
  //   NutshellApi.getRedLeads(user, function(err, response){
  //     this.redLeads = response;
  //     this.save();
  //   }.bind(this));
  // },

  	toJSON: function(){
  		var obj = this.toObject();
  		delete obj._csrf;
  		return obj;
  	}

  }
};

module.exports = User;
