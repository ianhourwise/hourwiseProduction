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
			//console.log('---Users----'+ users )
			res.locals.layout = "layouts/companyLayout"; 
			res.view({
				availableUsers: users
			});
		});

	},

	show: function(req, res, next){
		// console.log(req.params.all());
		Company.findOne(req.param('id')).populate('owner').populate('employees').exec( function foundCompany(err, company) {
			if(err) return next(err);

			var zendeskIds = [];

			for (var i = 0; i < company.employees.length; i++)
				zendeskIds.push(company.employees[i].id);

			var date = new Date();
			date.setDate(date.getDate() - (date.getDate() - 1));

			var ticketQuery = Task.find({requester: zendeskIds}).populate('requester');
			ticketQuery.where({type: 'zendesk', createdAtOriginal: {'>=': date}});

		//ticketQuery.exec(function (err, tickets) {

			//console.log(zendeskIds);
			
			ticketQuery.exec(function (err, tickets) {
				if (err)
					console.log(err);

				//console.log(tickets.length);

				var totalMinutesMonth = 0;

				for (var i = 0; i < tickets.length; i++)
					if (!isNaN(parseFloat(tickets[i].zendesk.fields[3].value)))
						totalMinutesMonth += parseFloat(tickets[i].zendesk.fields[3].value);

				//console.log('Total minutes - ' + totalMinutesMonth);

				tickets.sort(function (a, b) {
					return a.zendesk.status - b.zendesk.status;
				});

				res.locals.layout = "layouts/companyLayout";
				res.view(
				{ 
					company: company,
					tickets: tickets,
					totalMinutesMonth: totalMinutesMonth
					// user: {companySettings: {role: "Test", type: "Test type"}}
				});
			})
			
		});
	},

	updateMinutes: function (req, res) {
		//console.log(req.params.all());
		Company.update({id: req.param('id')}, {minutesPaid: parseFloat(req.param('minutesPaid')), minutesMax: parseFloat(req.param('maxMinutes'))}, function (err, companies) {
			if (err)
				res.send(err);

			res.send(null);
		});
	},	

	profile: function(req, res, next) {
		
		//console.log(req.user);
		if (req.session.User.myCompany == undefined) {
			res.locals.layout = 'layouts/layout';
			res.forbidden( 'You do not have permission to view this part of the site' );
		}

		Company.findOne({ id: req.session.User.myCompany}).populate('owner').populate('employees').exec(function foundCompany(err, company) {
			if(err) return next(err);
				if(!company) return next();
			//console.log(company);
			res.locals.layout = "layouts/layout";

			res.view('company/profile', 
			{
				// name: company.name,
				company: company
			});
		});
	},

	addCompany: function(req, res) {
		Zendesk.pullOrganizations(function (organizations) {
			//console.log(organizations);
			Company.find().exec(function (err, companies) {
				if (err)
					console.log(err);

				for (var i = 0; i < companies.length; i++)
					for (var j = 0; j < organizations.length; j++)
						if (organizations[j].id == null) {
							organizations.splice(j, 1);
							break;
						} 
						else if (companies[i].zendeskId == organizations[j].id) {
							organizations.splice(j, 1);
							break;
						}
				
				res.locals.layout = "layouts/addCompanyLayout";	

				res.view('company/add', {
					organizations: organizations
				});
			});
		});
	},

	nextStep: function (req, res) {
		Company.create({name: req.param('organizationName'), zendeskId: req.param('organizationId')}, function (err, company) {
			Zendesk.getUsersForOrganization(company.zendeskId, function (users) {
				res.locals.layout = "layouts/addNextLayout";	

				res.view('company/addNext', {
					users: users,
					company: company
				});
			});
		});
	},

	addOwner: function (req, res) {
		Company.update({id: req.param('companyId')}, {owner: req.param('user')}, function (err, companies) {
			if (err)
				console.log(err);

			res.send(companies[0]);
		});
	},

	create: function(req, res, next) {
	 	Company.create(req.params.all(), function companyCreated(err, company) {
	 		if(err) {
	 			console.log(err);

	 			return res.redirect('user/login');
	 		}

	 		User.update(req.param('owner'), {'myCompany': company.id, 'company': company.id}, function(err) {
	 			if (err) 
	 				console.log(err);
	 			//console.log('should be updating the user...');

	 			res.redirect('/company/show/'+ company.id); //send back true instead of reroute
	 		});

	 	});
	 

	 },

	 newProduct: function(req, res) {
	 	Company.findOne(req.param('company'), function (err, company) {
	 		var productsArray = [];

	 		if (company.productsAndServices != null)
	 			productsArray = company.productsAndServices;

	 		var uuid = require('node-uuid');

			var productId = uuid.v4();

			var newProduct = JSON.parse('{"id":"' + productId + '", "name":"' + req.param('name') + '", "description":"' + req.param('description') + '"}');

			productsArray.push(newProduct);

			Company.update(company.id, {productsAndServices: productsArray}, function (err, companies) {
				if (err)
					console.log(err);

				res.send(newProduct);
			});
	 	});
	 }

};

