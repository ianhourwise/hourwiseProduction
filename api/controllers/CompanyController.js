/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res) {
		//Should look for users without any company associations, but will fix that later.
		User.find({myCompany: null}).exec(function foundUsers(err, users) {
			console.log('---Users----'+ users )
			res.locals.layout = "layouts/layout"; 
			res.view({
				availableUsers: users
			});
		});

	},

	show: function(req, res, next){
		// console.log(req.params.all());
		Company.findOne(req.param('id'), function foundCompany(err, company){
			if(err) return next(err);
			res.locals.layout = "layouts/layout";
			res.view(
			{ 
				company: company
				// user: {companySettings: {role: "Test", type: "Test type"}}
			}
				);
		});
	},	

	profile: function(req, res, next) {
		
		console.log(req.user);
		if (req.session.User.myCompany == undefined)
			res.send(403);
		Company.findOne({ id: req.user.myCompany}).populate('owner').populate('employees').exec(function foundCompany(err, company) {
			if(err) return next(err);
				if(!company) return next();
			console.log(company);
			res.locals.layout = "layouts/layout";

			res.view('company/profile', 
			{
				// name: company.name,
				company: company
			});
		});
	},

	create: function(req, res, next) {
		//console.log('-----ABOUT TO CREATE COMPANY-----');
		console.log(req.params.all());
	 	Company.create(req.params.all(), function companyCreated(err, company) {
	 		if(err) {
	 			console.log(err);
	 			// req.session.flash = {
	 			// 	err: err
	 			// }


	 			return res.redirect('user/login');
	 		}

	 		User.update(req.param('owner'), {myCompany: company.id}, function(err) {
	 			if (err) 
	 				console.log(err);
	 			console.log('should be updating the user...');

	 			res.redirect('/company/show/'+company.id); //send back true instead of reroute
	 		});
	 	});
	 

	 }

};

