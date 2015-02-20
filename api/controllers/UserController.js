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
		res.locals.layout = "layouts/layout"; 
		return res.view('test');
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
 		res.redirect('/user/companysettings/' +req.param('id'));
 		});
 	}, 	


	dashboard: function(req, res, next) {
		console.log('got here');
		res.locals.layout = "layouts/layout"; 
		res.view('user/dashboard');
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
	    req.flash('error', 'Error.Passport.Email.Missing');
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

