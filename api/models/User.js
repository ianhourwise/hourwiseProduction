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

    tickets: { collection: 'task', via: 'requester'},

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

    getPerformanceMetrics: function(user, callback) {
    // NutshellApi.getSalesAnalytics(user, function(err, response){
    //   this.performanceMetrics = response;
    //   console.log(this.name);
    //   this.save();
    // }.bind(this));
      NutshellApi.getPerformanceReports(user, function(err, response) {
        if (err) {
          console.log('----------' + err);
          callback(user);
        }
        else {
          //console.log(response);
          user.integrations.nutshell.performanceMetrics = response;
          //console.log(user.integrations.nutshell.performanceMetrics === response);
          
          //console.log('success performance');
          user.save(callback(user));
        }  


        
        
      }.bind(this));
    },

    getRedLeadsNoCallback: function(user){
      NutshellApi.getRedLeads(user, function(err, response) {
        if (err) 
          console.log('----------' + err);
        
        user.integrations.nutshell.redLeads = response;
        // console.log(this.name);
        //console.log('success red leads');
        user.integrations.nutshell.lastSyncedOn.date = new Date();
        user.save(function (err, user) {
          //console.log(user.username);
        });

      }.bind(this));
    },

    getRedLeads: function(user, callback){
      NutshellApi.getRedLeads(user, function(err, response){
        if (err) {
          console.log('---------' + err);
          callback(user);
        }
        else {
          this.integrations.nutshell.redLeads = response;
          // console.log(this.name);
          //console.log('success red leads');
          //console.log(this.integrations.nutshell.redLeads === response);
          this.integrations.nutshell.lastSyncedOn.date = new Date();
          this.save(callback(this));   
        }
         
      }.bind(this));
    },

    addAlert: function(message, alertId, communicationId, zendesk) {

      var alerts = [];

      if (this.alerts != undefined)
        alerts = this.alerts;

      alerts.push({id: alertId, message: message, communicationId: communicationId, fromZendesk: zendesk});

      this.alerts = alerts;

      this.save();
    },

    removeAlert: function(id, callback) {
      if (this.alerts != undefined) {
        for (var i = 0; i < this.alerts.length; i++) {
          if (this.alerts[i].id == id) {
            this.alerts.splice(i, 1);
            break;
          }
            
        }

        this.save();

        callback(this);
      }
    },

    clearAllAlerts: function(callback) {
      if (this.alerts != undefined) {
        this.alerts = [];

        this.save();

        callback(this);
      }
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
