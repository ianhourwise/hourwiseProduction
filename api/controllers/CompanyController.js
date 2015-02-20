/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res) {
		res.locals.layout = "layouts/layout"; 
		return res.view('test');
	},

	profile: function(req, res, next) {
		
		console.log(req.user);
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

};

