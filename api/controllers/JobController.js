/**
 * JobController
 *
 * @description :: Server-side logic for managing jobs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function(req, res) {
		res.locals.layout = "layouts/layout";
		Contact.find().exec(function (err, contacts) {
			if (err)
				console.log(err);

			res.view({
				user: req.session.User,
				contacts: contacts
			});
		}); 
	},

	index: function(req, res) {
		res.locals.layout = "layouts/layout";
		Job.find().populate('recipients').populate('tasks').populate('owner').exec(function (err, jobs) {
			if (err)
				console.log(err)

			res.view({
				jobs: jobs
			});
		}); 
	},

	show: function(req, res) {
		res.locals.layout = "layouts/jobShowLayout";
		Job.findOne({id: req.param('id')}).populate('recipients').populate('tasks').populate('owner').populate('touches').exec(function (err, job) {
			res.view({
				job: job
			});
		}); 
	},

	create: function(req, res, next){

		console.log(req.params.all());

		Job.create(req.params.all(), function (err, job) {
			if (err)
				console.log(err);

			 res.redirect('/job/show/' + job.id);
		});

	  // Job.create(
	  //   req.params.all()
	  // , function (err, job) {
	  //   if (err) {
	  //     if (err.code === 'E_VALIDATION') {
	  //       if (err.invalidAttributes.email) {
	  //         req.flash('error', 'Error.Passport.Email.Exists');
	  //       } else {
	  //         req.flash('error', 'Error.Passport.User.Exists');
	  //       }
	  //     }
	
	  //     return next(err);
	  //   }
	
	  //   Passport.create({
	  //     protocol : 'local'
	  //   , password : password
	  //   , user     : user.id
	  //   }, function (err, passport) {
	  //     if (err) {
	  //       if (err.code === 'E_VALIDATION') {
	  //         req.flash('error', 'Error.Passport.Password.Invalid');
	  //       }
	
	  //       return user.destroy(function (destroyErr) {
	  //         next(destroyErr || err);
	  //       });
	  //     }
	
	  //     // next(null, user);
	  //     res.redirect('/job/show');
	  //   });
	  // });		
	
	
	
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

	pandaDoc: function(req, res) {
		res.view();
	},

	pandaDocSimulation: function(req, res) {
		console.log('I don\'t think we\'re getting logs...');

		var data = {
			"name": "Test Document",
			"template_uuid": "ibxvJootsfauJCQ6VsfuDH",
			"recipients": [
				{
					"email": "ian@hourwise.com",
					"first_name": "Ian",
					"last_name": "Kidd",
					"role": "Client"
				},
				{
					"email": "support@hourwise.com",
					"first_name": "Support",
					"last_name": "Hourwise"
				}
			],
			"tokens": [
				{
					"name": "Client.Company",
					"value": "Company 123"
				},
				{
					"name": "Client.StreetAddress",
					"value": "123 Main St."
				},
				{
					"name": "Client.City",
					"value": "Richmond"
				},
				{
					"name": "Client.State",
					"value": "VA"
				},
				{
					"name": "Client.Zip",
					"value": "23220"
				},
				{
					"name": "Client.Url",
					"value": "www.hourwise.com"
				},
				{
					"name": "Client.Name",
					"value": "Ian Kidd"
				},
				{
					"name": "Client.Email",
					"value": "ian@hourwise.com"
				},
				{
					"name": "Client.URL",
					"value": "www.hourwise.com"
				}
			]
		};

		PandaDoc.sendDocument(data, function (err) {
			if (!err)
				console.log('Cool, got it!');

			res.redirect('/user/dashboard');
		});
	},

	pandaDocRedirect: function(req, res) {
		console.log(req.params.all());

		var data = {
			"grant_type": "authorization_code",
			"client_id": "6b73487a706d423325fe",
			"client_secret": "70768e34804aee96b11bce7fe143d4945c9abc68",
			"code": req.param('code'),
			"scope": "read+write",
			"redirect_uri": "stage.hourwise.com/job/pandaDocSimulation"
		};
		var request = require('request');

		request.post({url: 'https://app.pandadoc.com/oauth2/access_token', form: data}, function (err, httpResponse, body) {
			console.log('err --- ' + err);
			console.log('http --- ' + JSON.stringify(httpResponse));
			console.log('body --- ' + body);

			var data = {
				"name": "Test Invoice",
				"template_uuid": "ibxvJootsfauJCQ6VsfuDH",
				"recipients": [
					{
						"email": "ian@hourwise.com",
						"first_name": "Ian",
						"last_name": "Kidd",
						"role": "Client"
					},
					{
						"email": "support@hourwise.com",
						"first_name": "Support",
						"last_name": "Hourwise"
					}
				],
				"tokens": [
					{
						"name": "Client.Company",
						"value": "Company 123"
					},
					{
						"name": "Client.StreetAddress",
						"value": "123 Main St."
					},
					{
						"name": "Client.City",
						"value": "Richmond"
					},
					{
						"name": "Client.State",
						"value": "VA"
					},
					{
						"name": "Client.Zip",
						"value": "23220"
					},
					{
						"name": "Client.Url",
						"value": "www.hourwise.com"
					},
					{
						"name": "Client.Name",
						"value": "Ian Kidd"
					},
					{
						"name": "Client.Email",
						"value": "ian@hourwise.com"
					},
					{
						"name": "Client.URL",
						"value": "www.hourwise.com"
					}
				]
			};

			var info = JSON.parse(body);

			console.log('info.access_token --- ' + info.access_token);

			PandaDoc.sendDocument(info.access_token, data, function (err) {
				if (!err)
					console.log('Cool, got it!');

				res.redirect('/user/dashboard');
			});
		});
	},

	documentUpdate: function(req, res) {
		console.log(req.params.all());

		var payload = req.param('0');
		var data = payload.data;
		var recipients = data.recipients;

		console.log(JSON.stringify(recipients));

		res.send(200);
	}

	
};

