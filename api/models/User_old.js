// /**
// * User.js
// *
// * @description :: TODO: You might write a short summary of how this model works and what it represents here.
// * @docs        :: http://sailsjs.org/#!documentation/models
// */
// var bcrypt = require('bcrypt');

// schema: true,
// // connection: ['someMongodbServer'],
// module.exports = {

//   attributes: {

//   	email: {
//   		type: 'email',
//   		required: true,
//   		unique: true
//   	},

//   	username: {
//       type: 'string',
//       defaultsTo: 'No Username',
//     },

//     password: {
//       type: 'string',
//       required: true
//     },

//     role: {
//     	type: 'string',
//     	enum: ['super_admin', 'admin', 'concierge', 'user'],
//     	defaultsTo: 'user'
//     },
//     // ownerCompany: {
//     //   model: 'Company'
//     // },


//     toJSON: function() {
//       var obj = this.toObject();
//       delete obj.password;
//       return obj;
//     }

//   },
//  beforeCreate: function(user, cb) {
//     bcrypt.genSalt(10, function(err, salt) {
//       bcrypt.hash(user.password, salt, function(err, hash) {
//         if (err) {
//           console.log(err);
//           cb(err);
//         }else{
//           user.password = hash;
//           cb(null, user);
//         }
//       });
//     });
//   }

// };


// // Docflow

// module.exports = {



//   attributes: {

//     knoxPassword: 'string',
//     knoxToken: 'string'
//   },

//   toJSON: function() {
//       var obj = this.toObject();
//       delete obj.password;
//       delete obj.knoxToken;
//       delete obj.knoxPassword;
//       delete obj.encryptedPassword;
//       delete obj._csrf;
//       return obj;
//   },

//   beforeCreate: function(values, cb) {
//     var bcrypt = require('bcrypt');

//   	bcrypt.hash(values.password, 10, function(err, hash) {
//   		if (err) return (cb(err));

//   		values.encryptedPassword = hash;
//   		cb();
//   	});
//   }

// };

// //fdash
// module.exports = {
// 	// schema: true,
//   // adapter: 'mongoose',


//   attributes: {
  	
//   	name: 'string',

//     email: {
//   		type: 'email',
//   		required: true,
//   		unique: true
//   	},

//   	company: 'string',

//   	encryptedPassword: {
//   		type: 'string',

//   	},

//     leads:{
//       collection: "Lead",
//       via: 'to'
//     },

//     referrals: {
//       collection: "Lead",
//       via: "from"

//     },

//     salesGoal: 'float',
// //NutshellAPI
// 	nutshellAPI_Key: 'string',
// 	nutshellAPI_Password: 'string',
// //Nutshell UserId
//   nutshellId: 'integer',
//   performanceMetrics: 'json',
//   redLeads: 'json', 

//   nutshellId: function() {
//     if (!this.nutshellAPI_Key || !this.nutshellAPI_Password) return null ;
//     id='Try to Refresh';
//     NutshellApi.getNutshellId("jon@hourwise.com","22b17e8532cef15c2dc2a4579caf94498c1d0324", 'Jon Hill', function(res){
//       id= res;
//     })
//     return id
//   },


//   getPerformanceMetrics: function(user){
//     // NutshellApi.getSalesAnalytics(user, function(err, response){
//     //   this.performanceMetrics = response;
//     //   console.log(this.name);
//     //   this.save();
//     // }.bind(this));
//     NutshellApi.getPerformanceReports(user, function(err, response){
//       this.performanceMetrics = response;
//       // console.log(this.name);
//       console.log('success performance');
//       this.save();
//     }.bind(this));
//   },

//   getRedLeads: function(user){
//     NutshellApi.getRedLeads(user, function(err, response){
//       this.redLeads = response;
//       // console.log(this.name);
//       console.log('success red leads');
//       this.save();
//     }.bind(this));	
//   },
//   	/* e.g.
//   	nickname: 'string'
//   	*/
//   	toJSON: function(){
//   		var obj = this.toObject();
//   		delete obj.password;
//   		delete obj.confirmation;
//   		delete obj.encryptedPassword;
//   		delete obj._csrf;
//   		return obj;
//   	}
    
//   },

//   beforeCreate: function (values, next){
//     if(!values.password || values.password != values.confirmation) {
//       return next({err: ['Password did not match password confirmation.']});
//     }

//     require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
//       if(err) return next(err);
//       values.encryptedPassword = encryptedPassword;
//       // values.performanceMetrics= {};
//       values.redLeads = {};
//       NutshellApi.getPerformanceReports({"nutshellAPI_Password": values.nutshellAPI_Password, 
//                                           "nutshellAPI_Key": values.nutshellAPI_Key, 
//                                           "nutshellId": values.nutshellId}, function(err, response){
//       values.performanceMetrics = response;
//       next();
//       });
     
//     });
    

//   },

//   afterCreate: function(newUser, next){
//     console.log('doing this...');
//     console.log(newUser);
//     console.log(newUser.name);
//     console.log(newUser.redLeads);

//     // user.getPerformanceMetrics(user);
//     // user.getRedLeads(user);

//     // User.findOne(newUser.id, function foundUser(err, user){
 
//     //   user.getPerformanceMetrics(user);
//     //   user.getRedLeads(user);
//     // });

//     next();
//   }
  
  

// };

