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
	
 			res.view({
 				user: user
 			});
 		});
 	},

	index: function(req, res) {
		User.find(function foundUsers(err, users){
	 		if(err) return next(err);

	 		res.view({
	 			users: users
	 		});
	 	});
	},

	new: function(req, res) {
		res.locals.layout = "layouts/layout"; 
		res.view('user/new');
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
			        res.redirect('/user/pending')
			        break;
			    default:
			        res.redirect('/user/profile');
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

