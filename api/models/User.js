var User = {
  // Enforce model schema in the case of schemaless databases
  //schema: true,
  connection: ['someMongodbServer'], 

  attributes: {
    username  : { type: 'string', defaultsTo: ''},
    email     : { type: 'email',  unique: true, required: true },
    passports : { collection: 'Passport', via: 'user' },

    role: {
    	type: 'string',
    	enum: ['superUser', 'admin', 'concierge', 'user'],
    	defaultsTo: 'user'
    },

    reroute: {
      type: 'string',
      defaultsTo: 'wizard'
    },

    wizardInfo:{
      type: 'json'
    },

    tasks: { collection: 'task', via: 'owner'},

    //For company owner's
    myCompany : { model: 'company', defaultsTo: null},

    //For employees:
    company: {model: 'company', defaultsTo: null},
    //Going to store company settings here for now, even though it's probably better to do in a relationship table...security issues?
    //{role: "admin", paymentInfo: {bank:"Chase", acctno: "sdfsdf"}, addres:{}, etc:{}}
    companySettings: {
    	type: 'json',
    	// defaultsTo: {role: 'manager', type: 'w2'}
    },
    // companyRelationship: {model: 'companyrelationship'},

    jobs: {collection: 'job', via: 'owner'},


    salesGoal: {
      type: 'float',
      defaultsTo: '350000'
    },
    //stores user metrics
    //{nutshell: {key:'', password: '', id: '', synced: 'datetime', metrics: [], etc:{}}}
    integrations: 'json',
    //put into integrations
	//NutshellAPI
	  nutshellAPI_Key: 'string',
	  nutshellAPI_Password: 'string',
	//Nutshell UserId
  	nutshellId: 'integer',
    lastSyncedOn: 'date',

    getPerformanceMetrics: function(user){
    // NutshellApi.getSalesAnalytics(user, function(err, response){
    //   this.performanceMetrics = response;
    //   console.log(this.name);
    //   this.save();
    // }.bind(this));
      NutshellApi.getPerformanceReports(user, function(err, response){
        this.integrations.nutshell.performanceMetrics = response;
        // console.log(this.name);
        console.log('success performance');
        this.save();

      }.bind(this));
    },

    getRedLeads: function(user){
      NutshellApi.getRedLeads(user, function(err, response){
        this.integrations.nutshell.redLeads = response;
        // console.log(this.name);
        console.log('success red leads');
        this.integrations.nutshell.lastSyncedOn.date = new Date();
        this.save();  
        
      }.bind(this));
    },

    // getSalesAnalytics: function(user) {
    //   NutshellApi.getSalesAnalytics(user, function(err, response){
    //     this.integrations.nutshell.redLeads = response;
    //     // console.log(this.name);
    //     console.log('success getSalesAnalytics');
    //     this.save();
    //   }.bind(this));
    // },

    

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

  },

  beforeCreate: function (attrs, next) {
      delete attrs.password;
      next();
    }
};

module.exports = User;
