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

 				Communication.find().populate('touches').exec(function (err, communications) { //.populate('createdBy').populate('contact')
 					if (err)
 						console.log(err);

 					res.view({
 						user: req.session.User,
		 				users: users,
		 				communications: communications
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
			User.find({where: {role: "user"}, sort: 'company ASC'}).populate('company').exec(function foundUsers(err, users){
		 		if(err) return next(err);

		 		var showGraph = false;

		 		var totalSales = 0.00;

		 		res.locals.layout = "layouts/userIndexWithGraph"; 

				for (var i = 0; i < users.length; i++) {
					//console.log(users[i].username);
					// if (users[i].company && users[i].company.name == 'Hourwise' && users[i].email != 'peter@hourwise.com' && users[i].email != 'randy@hourwise.com')
					// 	users.splice(i, 1);
					if (users[i].id == '55086ef16eb19e030076b996')
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
			User.find({where: {role: "user"}, sort: 'company ASC'}).populate('company').exec(function foundUsers(err, users){
		 		if(err) return next(err);

		 		var showGraph = false;

		 		var totalSales = 0.00;

		 		res.locals.layout = "layouts/userIndexWithGraph"; 

				for (var i = 0; i < users.length; i++) {
					//console.log(users[i].username);
					// if (users[i].company && users[i].company.name == 'Hourwise' && users[i].email != 'peter@hourwise.com' && users[i].email != 'randy@hourwise.com')
					// 	users.splice(i, 1);
					if (users[i].id == '55086ef16eb19e030076b996')
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
		//console.log(req.params.all());
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

				//console.log('Now we should be calling getRedLeads but it never gets invoked it seems....'); 

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

	addNumber: function(req, res) {
		if (req.param('fromDash')) {
			var formattedNumber = '+1' + req.param('primaryNumber');

			User.update(req.param('id'), {primaryNumber: formattedNumber}, function (err, users) {
				if (err)
					res.send('error');

				
				Communication.findOne({primaryNumber: formattedNumber}).populate('touches').exec(function (err, communication) {
					if (err)
						res.send('error');

					if (communication == null)
						res.send('not found');

					res.send(communication);
				});

				//res.send(users[0]);

			});
		}
	},

	update: function(req, res, next) {
		//console.log("---------"+JSON.stringify(req.params.all())+ "----------");

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
			    	//console.log('in switch statement');
			    	var wizardInfo = req.param('wizardInfo');
			    	
			    	Company.create({"company": wizardInfo.company, "industry": wizardInfo.industry, "sales": wizardInfo.sales ,"salesGoal": wizardInfo.salesGoal, "name": wizardInfo.company, "owner": req.param('id'), "primaryIndustry": wizardInfo.industry}, function (err, company) {
			    		if (err)
			    			return res.redirect('/user/edit/' + req.param('id'));

			    		User.update(req.param('id'), {'myCompany': company.id, 'company': company.id}, function(err) {
				 			if (err) 
				 				console.log(err);
				 			//console.log('should be updating the user...');

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
		User.subscribe(req.socket, req.param('id'));
		//User.publishUpdate(req.param('id'), { message: ' Pushing alert to users subscribed to this users dashboard', id: '1234', communicationId: '1234'  });
		User.findOne(req.param('id')).exec(function (err, user) {
 			// if (user.integrations == null) {
 			// 	res.view('user/simpleDash', {
 			// 		tasks: user.tasks
 			// 	})
 			// }
 			// else {
 				//console.log('+++++++++' + user.tickets.length + '+++++++++');
 				if(err) return next(err);
		 		if(!user) return next();
		 		// user.getPerformanceMetricsNoCallback(user);
	 			// user.getRedLeadsNoCallback(user);


	 			// if(user.integrations == null && user.integrations.nutshell == null && user.integrations.nutshell.performanceMetrics == null && user.integrations == null && user.integrations.nutshell == null && user.integrations.nutshell.redLead == null) {
	 			if(user.integrations != null && user.integrations.nutshell != null && user.integrations.nutshell.performanceMetrics != null && user.integrations.nutshell.redLeads != null) {
				 		//console.log('no PMs or Leads');
				 	console.log("I got into the first if");
					var salesData = JSON.stringify(user.integrations.nutshell.performanceMetrics.sales);
					var leadData = JSON.stringify(user.integrations.nutshell.performanceMetrics.leads);
					var pipelineData = JSON.stringify(user.integrations.nutshell.performanceMetrics.pipeline);
					var redMetrics = user.integrations.nutshell.redLeads.counts;
					var redLeads = user.integrations.nutshell.redLeads.leads;
					var displayDash = true;
				
					}

				else {
					console.log("setting data to empty");
					var salesData = {"summaryData" : {"won_lead_value": {"sum": 0}}};
					var leadData = {"seriesData" : {"won_leads": []}};
					var pipelineData = [];
					var redMetrics = [];
					var redLeads = [];
					var displayDash = false;
				}
				
				User.findOne(req.param('id')).populate('tasks').populate('company').populate('tickets').exec(function (err, user) { 
					var tasks = null;
					Communication.findOne({primaryNumber: user.primaryNumber}).populate('touches').exec(function (err, communication) {
						if (user.zendeskId != undefined) {
							//Task.find({type: 'zendesk'}).exec(function (err, tickets) {
								var organizationTickets = []
								//console.log('+++++++++' + user.tickets.length + '+++++++++')
								for (var i = 0; i < user.tickets.length; i++) 
									if (user.tickets[i].zendesk.status != 'closed' && user.tickets[i].zendesk.status != 'solved')
										organizationTickets.push(user.tickets[i].zendesk);
								
								res.locals.layout= 'layouts/dashboard_layout';
						 		res.view('user/conciergeDash', {
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
						 			tasks: tasks,
						 			communication: communication,
						 			organizationTickets: organizationTickets,
						 			displayDash: displayDash
						 		});
							// });
						}
						else {
							res.locals.layout= 'layouts/dashboard_layout';
					 		res.view('user/conciergeDash', {
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
					 			tasks: tasks,
					 			communication: communication,
					 			organizationTickets: null,
					 			displayDash: displayDash
					 		});	
						}
					});	
				});
		 		
 			// }
	 		
	 	});
	},

	admin: function(req, res, next) {
		//console.log('GOT TO ADMIN');
		
		if (req.session.User.role == 'superUser') {
			//console.log('YOU ARE SUPER');
			Company.find(function foundCompanies(err, companies){
				if(err) return next(err);
				if(!companies) return next(err);
				//console.log(companies);
				res.locals.layout = "layouts/layout";
				User.find().populate('myCompany').populate('company').exec(function (err, users) {
					Task.find({ where: {type: 'zendesk'}, limit: 3000, skip: 6000 }).exec(function (err, tickets) {
			//console.log(tickets);

						var totalTickets = tickets.length;

						//console.log('----------TICKET LENGTH--------' + totalTickets);

						var daysOfWeek = {
							'monday': 0,
							'tuesday': 0,
							'wendnesday': 0,
							'thursday': 0,
							'friday': 0,
							'saturday': 0,
							'sunday': 0
						};

						var cjSolved = {
							total: 0,
							tier1: 0,
							tier2: 0,
							tier3: 0,
							tier4: 0,
							tier5: 0
						};
						var cjId = 491576246;

						var stefanySolved = {
							total: 0,
							tier1: 0,
							tier2: 0,
							tier3: 0,
							tier4: 0,
							tier5: 0
						};
						var stefanyId = 889077333;

						var emilySolved = {
							total: 0,
							tier1: 0,
							tier2: 0,
							tier3: 0,
							tier4: 0,
							tier5: 0
						};
						var emilyId = 760940413;

						//console.log('++++++++++++++++++++' + totalTickets);
						var solved = [];
						var unsolvedTickets = [];
						var pendingTickets = [];
						var recentlySolved = [];

						for (var i = 0; i < totalTickets; i++) {
							var dateString = tickets[i].zendesk.updated_at;
						  	var year = parseInt(dateString.substring(0, 4));
						  	var month = parseInt(dateString.substring(5, 7));
						  	var day = parseInt(dateString.substring(7, 9));

					  		var createdAt = new Date(year, month, day); //using this to make it easier to handle dates 

					  		if (createdAt.getDay() == 0)
					  			daysOfWeek.sunday++;
					  		else if (createdAt.getDay() == 1)
					  			daysOfWeek.monday++;
					  		else if (createdAt.getDay() == 2)
					  			daysOfWeek.tuesday++;
					  		else if (createdAt.getDay() == 3)
					  			daysOfWeek.wendnesday++;
					  		else if (createdAt.getDay() == 4)
					  			daysOfWeek.thursday++;
					  		else if (createdAt.getDay() == 5)
					  			daysOfWeek.friday++;
					  		else if (createdAt.getDay() == 6)
					  			daysOfWeek.saturday++;

					  		if (tickets[i].zendesk.status == 'solved')
					  			recentlySolved.push(tickets[i].zendesk);

					  		if (tickets[i].zendesk.status == 'pending')
					  			pendingTickets.push(tickets[i].zendesk);

					  		if (tickets[i].zendesk.status != 'solved' && tickets[i].zendesk.status != 'closed')
					  			unsolvedTickets.push(tickets[i].zendesk);

					  		if (tickets[i].zendesk.status == 'solved' || tickets[i].zendesk.status == 'closed') {
					  			solved.push(tickets[i].zendesk);
					  			if (tickets[i].zendesk.assignee_id == cjId) {
					  				cjSolved.total = cjSolved.total + 1;

					  				if (tickets[i].zendesk.fields[0].value == 'tier_1')
					  					cjSolved.tier1++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_2')
					  					cjSolved.tier2++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_3')
					  					cjSolved.tier3++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_4')
					  					cjSolved.tier4++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_5')
					  					cjSolved.tier5++;
					  			}
					  			else if (tickets[i].zendesk.assignee_id == stefanyId) {
					  				stefanySolved.total++;

					  				if (tickets[i].zendesk.fields[0].value == 'tier_1')
					  					stefanySolved.tier1++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_2')
					  					stefanySolved.tier2++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_3')
					  					stefanySolved.tier3++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_4')
					  					stefanySolved.tier4++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_5')
					  					stefanySolved.tier5++;
					  			}
					  			else if (tickets[i].zendesk.assignee_id == emilyId) {
									emilySolved.total++;

									if (tickets[i].zendesk.fields[0].value == 'tier_1')
					  					emilySolved.tier1++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_2')
					  					emilySolved.tier2++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_3')
					  					emilySolved.tier3++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_4')
					  					emilySolved.tier4++;
					  				else if (tickets[i].zendesk.fields[0].value == 'tier_5')
					  					emilySolved.tier5++;
								}
					  		}

						}

						var solvedTickets = {
							tickets: solved
						};
						res.locals.layout = "layouts/zendeskGraphs"; 
						res.view('user/admin', {
							daysOfWeek: daysOfWeek,
							cjSolved: cjSolved,
							stefanySolved: stefanySolved,
							emilySolved: emilySolved,
							solvedTickets: solvedTickets,
							unsolvedTickets: unsolvedTickets,
							pendingTickets: pendingTickets,
							recentlySolved: recentlySolved,
							companies: companies,
							users: users
						});
					});
					// res.view({
					// 	companies: companies,
					// 	users: users
					// });	
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

	subscribeToAlerts: function (req, res) {
		if (req.session.User.role == 'superUser' || req.session.User.role == 'concierge') {
			User.subscribe(req.socket, req.session.User);
		}
	},

	subscribeToDashboard: function (req, res) {
		console.log(req.socket);
		var url = req.socket.handshake.headers.referer;
		var userId = '';

		for (var i = url.length - 1; i >= 0; i--)
			if (url[i] == '/') {
				for (var j = i + 1; j < url.length; j++)
					userId += url[j];
				break;
			}

		console.log(userId);

		User.subscribe(req.socket, userId);

		User.findOne({id: userId}, function (err, user) {
			if (err)
				console.log(err);

			console.log(user);

			NutshellApi.getPerformanceReports(user, function(err, response) {
		        if (err) {
		          console.log('----------' + err);
		          callback(user);
		        }
		        else {
		          console.log(response);
		          user.integrations.nutshell.performanceMetrics = response;
		          console.log(user.integrations.nutshell.performanceMetrics === response);
		          
		          console.log('success performance');
		       	  NutshellApi.getRedLeads(user, function(err, response) {
			        if (err) 
			          console.log('----------' + err);
			        
			        user.integrations.nutshell.redLeads = response;
			        // console.log(this.name);
			        //console.log('success red leads');
			        user.integrations.nutshell.lastSyncedOn.date = new Date();
			        
			        console.log('made it');

			        user.save(function (err, user) {
			        	console.log(user);
			        	User.publishUpdate(user.id, {user: user, fromDash: true});
			        });

			      });
		        }  
			});
		});
				
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
		Task.find({type: 'zendesk'}).exec(function (err, tickets) {
			//console.log(tickets);

			var totalTickets = tickets.length;

			var daysOfWeek = {
				'monday': 0,
				'tuesday': 0,
				'wendnesday': 0,
				'thursday': 0,
				'friday': 0,
				'saturday': 0,
				'sunday': 0
			};

			var cjSolved = {
				total: 0,
				tier1: 0,
				tier2: 0,
				tier3: 0,
				tier4: 0,
				tier5: 0
			};
			var cjId = 491576246;

			var stefanySolved = {
				total: 0,
				tier1: 0,
				tier2: 0,
				tier3: 0,
				tier4: 0,
				tier5: 0
			};
			var stefanyId = 889077333;

			var emilySolved = {
				total: 0,
				tier1: 0,
				tier2: 0,
				tier3: 0,
				tier4: 0,
				tier5: 0
			};
			var emilyId = 760940413;

			//console.log('++++++++++++++++++++' + totalTickets);
			var solved = [];
			var unsolvedTickets = [];
			var pendingTickets = [];
			var recentlySolved = [];

			for (var i = 0; i < totalTickets; i++) {
				var dateString = tickets[i].zendesk.created_at;
			  	var year = parseInt(dateString.substring(0, 4));
			  	var month = parseInt(dateString.substring(5, 7));
			  	var day = parseInt(dateString.substring(7, 9));

		  		var createdAt = new Date(year, month, day); //using this to make it easier to handle dates 

		  		if (createdAt.getDay() == 0)
		  			daysOfWeek.sunday++;
		  		else if (createdAt.getDay() == 1)
		  			daysOfWeek.monday++;
		  		else if (createdAt.getDay() == 2)
		  			daysOfWeek.tuesday++;
		  		else if (createdAt.getDay() == 3)
		  			daysOfWeek.wendnesday++;
		  		else if (createdAt.getDay() == 4)
		  			daysOfWeek.thursday++;
		  		else if (createdAt.getDay() == 5)
		  			daysOfWeek.friday++;
		  		else if (createdAt.getDay() == 6)
		  			daysOfWeek.saturday++;

		  		if (tickets[i].zendesk.status == 'solved')
		  			recentlySolved.push(tickets[i]);

		  		if (tickets[i].zendesk.status == 'pending')
		  			pendingTickets.push(tickets[i]);

		  		if (tickets[i].zendesk.status != 'solved' && tickets[i].zendesk.status != 'closed')
		  			unsolvedTickets.push(tickets[i]);

		  		if (tickets[i].zendesk.status == 'solved' || tickets[i].zendesk.status == 'closed') {
		  			solved.push(tickets[i].zendesk);
		  			if (tickets[i].zendesk.assignee_id == cjId) {
		  				cjSolved.total = cjSolved.total + 1;

		  				if (tickets[i].zendesk.fields[0].value == 'tier_1')
		  					cjSolved.tier1++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_2')
		  					cjSolved.tier2++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_3')
		  					cjSolved.tier3++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_4')
		  					cjSolved.tier4++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_5')
		  					cjSolved.tier5++;
		  			}
		  			else if (tickets[i].zendesk.assignee_id == stefanyId) {
		  				stefanySolved.total++;

		  				if (tickets[i].zendesk.fields[0].value == 'tier_1')
		  					stefanySolved.tier1++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_2')
		  					stefanySolved.tier2++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_3')
		  					stefanySolved.tier3++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_4')
		  					stefanySolved.tier4++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_5')
		  					stefanySolved.tier5++;
		  			}
		  			else if (tickets[i].zendesk.assignee_id == emilyId) {
						emilySolved.total++;

						if (tickets[i].zendesk.fields[0].value == 'tier_1')
		  					emilySolved.tier1++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_2')
		  					emilySolved.tier2++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_3')
		  					emilySolved.tier3++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_4')
		  					emilySolved.tier4++;
		  				else if (tickets[i].zendesk.fields[0].value == 'tier_5')
		  					emilySolved.tier5++;
					}
		  		}

			}

			var solvedTickets = {
				tickets: solved
			};
			res.locals.layout = "layouts/zendeskGraphs"; 
			res.view('user/zendeskAdmin', {
				daysOfWeek: daysOfWeek,
				cjSolved: cjSolved,
				stefanySolved: stefanySolved,
				emilySolved: emilySolved,
				solvedTickets: solvedTickets,
				unsolvedTickets: unsolvedTickets,
				pendingTickets: pendingTickets,
				recentlySolved: recentlySolved
			});
		});
	},

	conciergeZendesk: function(req, res) {
		Task.find({type: 'zendesk'}).exec(function (err, tickets) {
			var unassigned = [];
			var unsolved = [];

			//req.session.User.integrations.zendesk.id = 491576246;

			for (var i = 0; i < tickets.length; i++) {
				if (tickets[i].zendesk.assignee_id == null)
					unassigned.push(tickets[i].zendesk);
				else if (tickets[i].zendesk.assignee_id == req.session.User.zendeskId && tickets[i].zendesk.status != 'solved' && tickets[i].zendesk.status != 'closed')
					unsolved.push(tickets[i].zendesk);
			}	

			res.view('user/conciergeZendesk', {
				unassignedTickets: unassigned,
				unsolvedTickets: unsolved
			});
		});
	},

	welcome: function(req, res) {
		res.locals.layout = false;
		User.findOne({id: req.param('id')}, function (err, user) {
			res.view('newClientForm', {
				user: user
			});
		});	
	},

	onboardDump: function(req, res) {
		//console.log(req.params.all());
		var newClient = req.param('newClient');
		User.update({id: req.param('id')}, {newClientData: newClient}, function (err, user) {
			res.view('user/thanks');
		});
	},

	uploadAvatar: function(req, res) {
		req.file('avatar').upload({
		  adapter: require('skipper-s3'),
		  key: 'AKIAJMGKEQ53X5FJMEUQ',
		  secret: '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',
		  bucket: 'docflow-dev',
		  region: 'us-west-2'
		}, function (err, files) {
	      if (err)
	        return res.serverError(err);

	      //return res.send('<img src="' + files[0].extras.Location + '">');

	      console.log(JSON.stringify(files) + '------' + JSON.stringify(files[0]));

	      User.update(req.param('id'), {avatar: files[0].extra.Location}, function (err, users) {
	      	res.redirect('user/profile');
	      });

	      // File.create(files[0], function(err, file) {
	      // 	Company.update(req.session.User.ownerCompany, {companyLogo: file}, function(err) {
		     //  return res.send();	
	      // 	});
	    // });
	  });
	},

	addReferral: function(req, res) {
		console.log('got here');
		User.findOne({id: req.param('id')}, function (err, user) {
			if (err)
				console.log(err);

			var referralsArray = [];

			if (user.referrals != null)
				referralsArray = user.referrals;

			var uuid = require('node-uuid');

			var referralId = uuid.v4();

			var newReferral = JSON.parse('{"id":"' + referralId + '", "name":"' + req.param('name') + '", "email":"' + req.param('email') + '", "phoneNumber":"' + req.param('phoneNumber') + '", "createdAt":"' + new Date() + '"}');

			referralsArray.push(newReferral);

			User.update(user.id, {referrals: referralsArray}, function (err, users) {
				if (err)
					console.log(err);

				res.send(200);
			});
		});
	}	
	
};

