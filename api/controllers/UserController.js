/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



 	edit: function(req, res, next){
 		User.findOne(req.param('id')).populate('company').exec( function foundUser(err, user) {
 			if(err) return next(err);
 			if(!user) return next('User doesn\'t exist!');

 			var isSuperUser = false;

 			if (req.session.User.role == 'superUser')
 				isSuperUser = true;

 			Company.find(function (err, companies) {
 				res.view({
					user: user,
					isSuperUser: isSuperUser,
					companies: companies
				});
 			});
 		});
 	},

 	integrateNutshell: function(req, res) {
 		User.findOne(req.param('id'), function foundUser(err, user){
 			if(err) return next(err);
 			if(!user) return next('User doesn\'t exist!');

 			res.view({
 				user: user
  			});
 		});
 	},

 	communications: function(req, res) {
 		if (req.session.User.role != 'user') {
 			User.find(function (err, users) {

 				Touch.find({type: 'sms'}).populate('createdBy').populate('contact').exec(function (err, touches) {
 					if (err)
 						console.log(err);

 					res.view({
 						user: req.session.User,
		 				users: users,
		 				touches: touches
	 				});
		 				
 				});
 			});
 		}
 		else
 			res.send(403);
 	},

 	talkedTo: function(req, res) {
 		User.findOne(req.param('id'), function (err, user) {
 			if (err)
 				res.send(err);
 			var calls = {};
 			if (user.calls != undefined) {
 				calls = user.calls;
 				calls.callCount = calls.callCount + 1;
 				calls.calledBy.push([req.session.User.id, new Date()]);
 			}
 				
 			else
 				calls = {
 					callCount: 1,
 					calledBy: [req.session.User.id, new Date()]
 				};

 			User.update(req.param('id'), {calls: calls}, function (err) {
 				if (err)
 					res.send('error');
 				res.send('a-ok');
 			});
 		});
 	},

	index: function(req, res) {

		if (req.session.User.role == 'superUser') {
			User.find().populate('company').exec(function foundUsers(err, users){
		 		if(err) return next(err);

		 		var showGraph = true;

		 		var totalSales = 0.00;

		 		res.locals.layout = "layouts/userIndexWithGraph"; 

				for (var i = 0; i < users.length; i++) {
					console.log(users[i].username);
					if (users[i].company && users[i].company.name == 'Hourwise' && users[i].email != 'peter@hourwise.com' && users[i].email != 'randy@hourwise.com')
						users.splice(i, 1);
					if (users[i].integrations != undefined) {
						totalSales += users[i].integrations.nutshell.performanceMetrics.sales.summaryData.won_lead_value.sum;

						var openLeadsByDay = users[i].integrations.nutshell.performanceMetrics.pipeline.seriesData.open_leads;

						users[i].numOpened = openLeadsByDay[openLeadsByDay.length - 1][1];

						
						}

						var currentDate = new Date();
						var weekAgo = new Date();

						weekAgo.setDate(weekAgo.getDate() - 7);

						var callCount = 0;

						if (users[i].calls != undefined) {
							for (var j = 0; j < users[i].calls.calledBy.length; j++) {
								if (users[i].calls.calledBy[j][1] >= weekAgo)
									callCount++;
							}

							users[i].callsThisWeek = callCount;
					}
						
				}

		 		res.view('user/conciergeIndex', {
		 			users: users,
		 			totalSales: totalSales,
		 			showGraph: showGraph
		 		});
		 	});
		}

		else if (req.session.User.role == 'concierge') {
			User.find().populate('company').exec(function foundUsers(err, users){
		 		if(err) return next(err);

		 		var showGraph = true;

		 		var totalSales = 0.00;

		 		res.locals.layout = "layouts/userIndexWithGraph"; 

				for (var i = 0; i < users.length; i++) {
					console.log(users[i].username);
					if (users[i].company && users[i].company.name == 'Hourwise' && users[i].email != 'peter@hourwise.com' && users[i].email != 'randy@hourwise.com')
						users.splice(i, 1);
					if (users[i].integrations != undefined){
						try {
							totalSales += users[i].integrations.nutshell.performanceMetrics.sales.summaryData.won_lead_value.sum;

							var openLeadsByDay = users[i].integrations.nutshell.performanceMetrics.pipeline.seriesData.open_leads;

							users[i].numOpened = openLeadsByDay[openLeadsByDay.length - 1][1];

							var currentDate = new Date();
							var weekAgo = new Date();

							weekAgo.setDate(weekAgo.getDate() - 7);

							var callCount = 0;

							if (users[i].calls != undefined) {
								for (var j = 0; j < users[i].calls.calledBy.length; j++) {
									if (users[i].calls.calledBy[j][1] >= weekAgo)
										callCount++;
								}

								users[i].callsThisWeek = callCount;
							}	
						}
						catch(err){
							totalSales += 0;
						}
					}
				}

		 		res.view('user/conciergeIndex', {
		 			users: users,
		 			totalSales: totalSales,
		 			showGraph: showGraph
		 		});
		 	});
		}

		else if (req.session.User.role == 'user') {
				var showGraph = false;

		 		var totalSales = 0.00;

		 		if (req.session.User.integrations != undefined)
						totalSales += req.session.User.integrations.nutshell.performanceMetrics.sales.summaryData.won_lead_value.sum;

				User.findOne(req.session.User.id).populate('company').exec( function (err, user) {
					res.view({
			 			users: [user],
			 			totalSales: totalSales,
			 			showGraph: showGraph
		 			});
				});
		}

		else
			res.send(403);	
	},

	getUsers: function(req, res) {
		User.find().populate('company').exec(function foundUsers(err, users) {
	 		if(err) return next(err);

	 		res.send(users);
	 	});
	},

	new: function(req, res) {
		res.locals.layout = "layouts/layout"; 
		res.view('user/new');
	},

	addNutshellCredentials: function(req, res) {
		console.log(req.params.all());
		var performanceMetrics = {};
		var redLeads = {};

		User.update(req.param('id'), { 'integrations': { 'nutshell': { 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId'), 'lastSyncedOn': { 'date': new Date() } , 'performanceMetrics': {} , 'redLeads': {} } } }, function (err) {
			if(err) {
 				return res.redirect('/user/edit/'+ req.parm('id'));
 			}

			NutshellApi.getPerformanceReports( { 'integrations': { 'nutshell': { 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId') } } }, function (err, response) {
				if(err) {
 					return res.redirect('/user/edit/'+ req.parm('id'));
 				}
				performanceMetrics = response;

				console.log('Now we should be calling getRedLeads but it never gets invoked it seems....'); 

				NutshellApi.getRedLeads( { 'integrations': { 'nutshell': { 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId') } } }, function (err, response1) {
					if(err) {
 						return res.redirect('/user/edit/'+ req.parm('id'));
 					}
					redLeads = response1;

					var nutshell = { 'nutshell': { 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId'), 'lastSyncedOn': { 'date': new Date() } , 'performanceMetrics': {} , 'redLeads': {} } } ;

					nutshell.nutshell.performanceMetrics = performanceMetrics;
					nutshell.nutshell.redLeads = redLeads;

					User.update(req.param('id'), { 'integrations': nutshell}, function (err, updated) {
						// var uuid = require('node-uuid');

						// var alertId = uuid.v4();

						// User.find({ id: { '!' : req.session.User.id } }).exec( function (err, users) {
			 		// 		for (var i = 0; i < users.length; i++) {
			 		// 			if (users[i].role == 'superUser' || users[i].role == 'concierge') {
			 		// 				users[i].addAlert(user.username + ' just had their nutshell data synced!', alertId);
			 		// 				User.publishUpdate(users[i].id, { message: user.username + ' just had their nutshell data synced!', id: alertId });
			 		// 			}
			 		// 		}
									
			 		// 	});
											
						res.redirect('/user/dashboard/' + req.param('id'));
					});
				});

			});
		});
	},

	update: function(req, res, next) {
		console.log("---------"+JSON.stringify(req.params.all())+ "----------");

		User.update(req.param('id'), req.params.all(), function userUpdated (err){
 			if(err) {
 				return res.redirect('/user/edit/'+ req.parm('id'));
 			}

 			var parsed_url = {}
 			var url = req.headers['referer'];
 			protocol_i = url.indexOf('://');
    		parsed_url.protocol = url.substr(0,protocol_i);
    		remaining_url = url.substr(protocol_i + 3, url.length);
    		domain_i = remaining_url.indexOf('/');
    		domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    		parsed_url.domain = remaining_url.substr(0, domain_i);
    		parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);
    		domain_parts = parsed_url.domain.split('.');

 			switch(parsed_url.path) {
			    case 'user/companysettings':
			        res.redirect('/user/companysettings/' +req.param('id'));
			        break;
			    case 'user/wizard':
			    	console.log('in switch statement');
			    	var wizardInfo = req.param('wizardInfo');
			    	
			    	Company.create({"company": wizardInfo.company, "industry": wizardInfo.industry, "sales": wizardInfo.sales ,"salesGoal": wizardInfo.salesGoal, "name": wizardInfo.company, "owner": req.param('id'), "primaryIndustry": wizardInfo.industry}, function (err, company) {
			    		if (err)
			    			return res.redirect('/user/edit/' + req.param('id'));

			    		User.update(req.param('id'), {'myCompany': company.id, 'company': company.id}, function(err) {
				 			if (err) 
				 				console.log(err);
				 			console.log('should be updating the user...');

				 			res.redirect('/user/pending') 
				 		});
			    		

			    	});
			    	break;
			    case 'user/admin':
			    	res.redirect('/user/admin');
			    	break;
			    default:
			        res.redirect('/user/index/');
			}
 			
 		});
 	}, 	


 	wizard: function(req, res, next) {
 		
 		res.locals.layout = false;
 		res.view('user/wizard',{
 			user: req.session.User
 		});

 	},

 	pending: function(req, res, next){
 		res.locals.layout = false;
 		// res.redirect('http://www.google.com')
 		res.view('user/pending')
 	},

	dashboard: function(req, res, next) {
		User.findOne(req.param('id')).populate('tasks').populate('company').exec(function (err, user) {
 			if (user.integrations == null) {
 				res.view('user/simpleDash', {
 					tasks: user.tasks
 				})
 			}
 			else {
 				if(err) return next(err);
		 		if(!user) return next();
		 		user.getPerformanceMetrics(user, function () {
		 			user.getRedLeads(user, function() {
		 				if(user.integrations == null && user.integrations.nutshell == null && user.integrations.nutshell.performanceMetrics == null && user.integrations == null && user.integrations.nutshell == null && user.integrations.nutshell.redLead == null) {
				 			console.log('no PMs or Leads');
				 			var salesData = {"summaryData" : {"won_lead_value": {"sum": 0}}};
							var leadData = {"seriesData" : {"won_leads": []}};
							var pipelineData = [];
							var redMetrics = [];
							var redLeads = [];
				 
						}

						else {
							console.log('got the data');
							var salesData = JSON.stringify(user.integrations.nutshell.performanceMetrics.sales);
							var leadData = JSON.stringify(user.integrations.nutshell.performanceMetrics.leads);
							var pipelineData = JSON.stringify(user.integrations.nutshell.performanceMetrics.pipeline);
							var redMetrics = user.integrations.nutshell.redLeads.counts;
							var redLeads = user.integrations.nutshell.redLeads.leads;
						}

						var tasks = user.tasks;

				 		res.locals.layout= 'layouts/dashboard_layout';
					 		res.view({
					 			user: user,
					 			salesData: salesData,
					 			leadData: leadData,
					 			pipelineData: pipelineData,
					 			// redMetrics: nsResponse.counts,
					 			// redLeads: nsResponse.leads
					 			// redMetrics: redMetrics,
					 			// redLeads: redLeads
					 			redMetrics: redMetrics,
					 			redLeads: redLeads,
					 			tasks: tasks
					 		});
		 			});	
		 		});
		 		
		 		// 	var uuid = require('node-uuid');

					// var alertId = uuid.v4();

		 		// 	User.find({ id: { '!' : req.session.User.id } }).exec( function (err, users) {
		 		// 		for (var i = 0; i < users.length; i++) {
		 		// 			if (users[i].role == 'superUser' || users[i].role == 'concierge') {
		 		// 				users[i].addAlert(user.username + ' just had their nutshell data synced!', alertId);
		 		// 				User.publishUpdate(users[i].id, { message: user.username + ' just had their nutshell data synced!', id: alertId });
		 		// 			}
		 					
		 		// 		}
								
		 		// 	});
		 		//});
		 		//console.log(user.integrations.nutshell.performanceMetrics);
		 		
 			}
	 		
	 	});
	},

	admin: function(req, res, next) {
		console.log('GOT TO ADMIN');
		if(req.session.User.role == 'superUser') {
			console.log('YOU ARE SUPER');
			Company.find(function foundCompanies(err, companies){
				if(err) return next(err);
				if(!companies) return next(err);
				console.log(companies);
				res.locals.layout = "layouts/layout";
				User.find().populate('myCompany').populate('company').exec(function (err, users) {
					res.view({
						companies: companies,
						users: users
					});	
				});
			});	
		}
		
		else{ 
			req.flash('error','tsk tsk...you are NOT superMan!');
			res.redirect('/user/dashboard');
		}
	},


	profile: function(req, res, next){
		res.locals.layout = "layouts/layout";
		User.findOne(req.session.User.id).populate('tasks').populate('company').exec(function (err, user) {
			res.view('user/profile', {
				user: user,
				tasks: user.tasks
			});
		});	
		
	},	

	calendar: function(req, res, next){
		res.locals.layout = "layouts/layout";
		res.view('user/calendar');
	},


	companysettings: function(req, res, next){
		// console.log(req.params.all());
		User.findOne(req.param('id'), function foundUser(err, user){
			if(err) return next(err);
			res.locals.layout = "layouts/layout";
			res.view(
			{ 
				user: user
				// user: {companySettings: {role: "Test", type: "Test type"}}
			}
				);
		});
	},
			
	create: function(req, res, next){
	  var email    = req.param('email')
	    , username = req.param('username')
	    , password = req.param('password')
	    , companySettings = req.param('companySettings');
	
	  if (!email) {
	    req.flash('error', 'Sorry, looks like you forgot an email address!');
	    // req.flash('error', 'Error.Passport.Email.Missing');
	    return next(new Error('No email was entered.'));
	  }
	
	  if (!username) {
	    req.flash('error', 'Error.Passport.Username.Missing');
	    return next(new Error('No username was entered.'));
	  }
	
	  if (!password) {
	    req.flash('error', 'Error.Passport.Password.Missing');
	    return next(new Error('No password was entered.'));
	  }
	  User.create(
	  // {
	
	    // username : username,
	    // email    : email,
	    // companySettings: companySettings
	    req.params.all()

	  // }
	  , function (err, user) {
	    if (err) {
	      if (err.code === 'E_VALIDATION') {
	        if (err.invalidAttributes.email) {
	          req.flash('error', 'Error.Passport.Email.Exists');
	        } else {
	          req.flash('error', 'Error.Passport.User.Exists');
	        }
	      }
	
	      return next(err);
	    }	    
	     Passport.create({
			      protocol : 'local'
			    , password : password
			    , user     : user.id
			    }, function (err, passport) {
			      if (err) {
			        if (err.code === 'E_VALIDATION') {
			          req.flash('error', 'Error.Passport.Password.Invalid');
			        }
			
			        return user.destroy(function (destroyErr) {
			          next(destroyErr || err);
			        });
			      }
			
			      // next(null, user);
			      var parsed_url = {}
				  var url = req.headers['referer'];
				  protocol_i = url.indexOf('://');
				  parsed_url.protocol = url.substr(0,protocol_i);
				  remaining_url = url.substr(protocol_i + 3, url.length);
				  domain_i = remaining_url.indexOf('/');
				  domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
				  parsed_url.domain = remaining_url.substr(0, domain_i);
				  parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);
				  domain_parts = parsed_url.domain.split('.');



				  if (parsed_url.path == 'user/admin')
				  	res.redirect('/user/admin')
				  else
			      	res.redirect('/company/profile');
			   });
	   });	
	
	},

	subscribe: function (req, res) {
		console.log(req.isSocket);
		User.find({role: ['superUser', 'concierge']}).exec( function (err, users) {
			if (err)
				console.log(err);

			User.subscribe(req.socket, users);
			console.log('subscribed');
		});
	},

	subscribeToAlerts: function (req, res) {
		User.subscribe(req.socket, req.session.User);
		console.log('subscribed to yourself?');
	},

	dismissAlert: function (req, res) {
		User.findOne(req.session.User.id, function (err, user) {
			user.removeAlert(req.param('alertId'), function (user) {
				req.session.User = user;

				res.send('cool beans');
			});
		});
	},

	clearAllAlerts: function (req, res) {
		User.findOne(req.session.User.id, function (err, user) {
			user.clearAllAlerts(function (user) {
				req.session.User = user;

				res.send('well alrightttt');
			});
		});
	},

	zendeskTickets: function (req, res) {
		Zendesk.listTickets(function (tickets) {
			console.log(tickets);
		});
	}
	
};

