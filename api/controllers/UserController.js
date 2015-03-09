/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



 	edit: function(req, res, next){
 		User.findOne(req.param('id'), function foundUser(err, user){
 			if(err) return next(err);
 			if(!user) return next('User doesn\'t exist!');

 			var isSuperUser = false;

 			if (req.session.User.role == 'super_user')
 				isSuperUser = true;

 			res.view({
 				user: user,
 				isSuperUser: isSuperUser
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
 				res.view({
 				user: req.session.User,
 				users: users
 			});
 			});
 		}
 		else
 			res.send(403);
 	},

 	sendEmail: function(req, res) {
 		console.log(req.params.all());
 		Mandrill.sendEmail(req.params.all(), function (err) {
 			if (err) 
 				console.log(err);
 			else {
 				var date = new Date();
 				var emails = [];

 				if (req.session.User.emails != undefined)
 					emails = req.session.User.emails;

 				emails.push({'sentOn': date, 'sentTo': req.param('toEmail'), 'sentFrom': req.param('fromEmail')});

 				User.update(req.session.User.id, {'emails': emails}, function(err) {
 					if (err)
 						console.log('----' + error);
 					res.redirect('/user/communications');
 				});
 			}
 		});
 	},

 	testSMS: function(req, res) {
 		Twilio.sendSMS({toNumber: '7578807276', smsContent: 'Sent from hourwise.com...'});
 	},

	index: function(req, res) {

		if (req.session.User.role == 'super_user') {
			User.find(function foundUsers(err, users){
		 		if(err) return next(err);

		 		var showGraph = true;

		 		var totalSales = 0.00;

		 		res.locals.layout = "layouts/userIndexWithGraph"; 

				for (var i = 0; i < users.length; i++) {
					console.log(users[i].username);
					if (users[i].performanceMetrics != undefined)
						totalSales += users[i].performanceMetrics.sales.summaryData.won_lead_value.sum;
				}

		 		res.view({
		 			users: users,
		 			totalSales: totalSales,
		 			showGraph: showGraph
		 		});
		 	});
		}

		else if (req.session.User.role == 'concierge') {
			User.find(function foundUsers(err, users){
		 		if(err) return next(err);

		 		var showGraph = true;

		 		var totalSales = 0.00;

		 		res.locals.layout = "layouts/userIndexWithGraph"; 

				for (var i = 0; i < users.length; i++) {
					console.log(users[i].username);
					if (users[i].performanceMetrics != undefined)
						totalSales += users[i].performanceMetrics.sales.summaryData.won_lead_value.sum;
				}

		 		res.view({
		 			users: users,
		 			totalSales: totalSales,
		 			showGraph: showGraph
		 		});
		 	});
		}

		else if (req.session.User.role == 'user') {
				var showGraph = false;

		 		var totalSales = 0.00;

		 		if (req.session.User.performanceMetrics != undefined)
						totalSales += req.session.User.performanceMetrics.sales.summaryData.won_lead_value.sum;

		 		res.view({
		 			users: [req.session.User],
		 			totalSales: totalSales,
		 			showGraph: showGraph
		 		});
		}

		else
			res.send(403);	
	},

	getUsers: function(req, res) {
		User.find(function foundUsers(err, users){
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

		User.update(req.param('id'), { 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId') }, function(err) {
			NutshellApi.getPerformanceReports({ 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId') }, function(err, response) {
				performanceMetrics = response;

				User.update(req.param('id'), { performanceMetrics: performanceMetrics}, function(err, response) {

					console.log('Now we should be calling getRedLeads but it never gets invoked it seems....'); 

					NutshellApi.getRedLeads({ 'nutshellAPI_Password': req.param('nutshellAPI_Password'), 'nutshellAPI_Key': req.param('nutshellAPI_Key'), 'nutshellId': req.param('nutshellId') }, function(err, response1) {
						redLeads = response1;

						User.update(req.param('id'), { redLeads: redLeads}, function(err, response) {

									res.redirect('/user/newDashTest/' + req.param('id'));

						});
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
			    	var wizardInfo = req.param('wizardInfo');
			    	
			    	Company.create({"company": wizardInfo.company, "industry": wizardInfo.industry, "sales": wizardInfo.sales ,"salesGoal": wizardInfo.salesGoal, "name": wizardInfo.company, "owner": req.param('id'), "primaryIndustry": wizardInfo.industry}, function (err, company) {
			    		if (err)
			    			return res.redirect('/user/edit/' + req.param('id'));

			    		res.redirect('/user/pending')
			    	});
			    	break;
			    default:
			        res.redirect('/user/newDashTest/' + req.param('id'));
			}
 			
 		});
 	}, 	


 	wizard: function(req, res, next) {
 		
 		res.locals.layout = false;
 		res.view('user/wizard');

 	},

 	pending: function(req, res, next){
 		res.locals.layout = false;
 		// res.redirect('http://www.google.com')
 		res.view('user/pending')
 	},

	dashboard: function(req, res, next) {
		res.locals.layout = "layouts/layout"; 
		res.view('user/dashboard');
	},

	newDashTest: function(req, res, next) {
 		User.findOne(req.param('id'), function foundUser(err, user){
	 		if(err) return next(err);
	 		if(!user) return next();
	 		user.getPerformanceMetrics(user);
	 		user.getRedLeads(user);
	 		console.log(user.performanceMetrics);
	 		if(user.performanceMetrics ==={} || user.redLead === {}){
	 			console.log('no PMs or Leads');
	 			var salesData = {"summaryData" : {"won_lead_value": {"sum": 0}}};
				var leadData = {"seriesData" : {"won_leads": []}};
				var pipelineData = [];
				var redMetrics = [];
				var redLeads = [];
	 
			}

			else{
				console.log('got the data');
				var salesData = JSON.stringify(user.performanceMetrics.sales);
				var leadData = JSON.stringify(user.performanceMetrics.leads);
				var pipelineData = JSON.stringify(user.performanceMetrics.pipeline);
				var redMetrics = user.redLeads.counts;
				var redLeads = user.redLeads.leads;
			}
	 		
	 		var date = new Date();

	 		User.update(req.param('id'), { lastSyncedOn: date}, function(err) {
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
		 			redLeads: redLeads
		 		});
	 		});
	 	});
 	},

	admin: function(req, res, next) {
		res.locals.layout = "layouts/layout"; 
		res.view('user/admin');
	},

	profile: function(req, res, next){
		res.locals.layout = "layouts/layout";
		res.view('user/profile');
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

	    Company.create(req.param('wizardInfo'), function (err, company) {
	    	if (err) 
		        req.flash('error', 'Error creating company...');

		    console.log('Created company????');
		    
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
		      res.redirect('/company/profile');
		    });
	    });
	  });		
	
	
	
			// User.create(req.params.all(), function userCreated(err, user){
			// 	if(err) {
			// 		console.log(err);
			// 		req.session.flash = {
			// 			err: err
			// 		}
	
	
			// 		return res.redirect('/company/profile');
			// 	}
	
	
				// res.json(user);
				// res.redirect('user/show/'+ user.id);
				// res.redirect('/company/profile');
				// req.session.flash = {};
			// });
	


	},
	_config:{}
	
};

