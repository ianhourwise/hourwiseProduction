/**
 * JobController
 *
 * @description :: Server-side logic for managing jobs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function(req, res) {
		res.locals.layout = "layouts/layout";
		Company.findOne(req.session.User.company).populate('groups').populate('contacts').exec(function (err, company) {
			if (err)
				console.log(err);

			res.view({
				user: req.session.User,
				contacts: company.contacts,
				groups: company.groups,
				company: company,
				productsAndServices: company.productsAndServices
			});
		});
	},

	index: function(req, res) {
		res.locals.layout = "layouts/layout";
		Job.find().populate('recipients').populate('tasks').populate('owner').populate('client').exec(function (err, jobs) {
			if (err)
				console.log(err)

			res.view({
				jobs: jobs
			});
		}); 
	},

	show: function(req, res) {
		res.locals.layout = "layouts/jobShowLayout";
		Job.findOne({id: req.param('id')}).populate('recipients').populate('tasks').populate('client').populate('owner').populate('touches').exec(function (err, job) {
			if (err)
				console.log(err);

			var tasksLeftToComplete = 0;
			for (var i = 0; i < job.tasks.length; i++)
				if (job.tasks[i].completed != true)
					tasksLeftToComplete++;

			res.view({
				job: job,
				currentUser: req.session.User.email,
				tasksLeftToComplete: tasksLeftToComplete
			});
		}); 
	},

	create: function(req, res, next){

		Job.create(req.params.all(), function (err, job) {
			if (err)
				console.log(err);

			 res.redirect('/job/show/' + job.id);
		});
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

	updateStatus: function (req, res) {
		Job.update(req.param('id'), {status: req.param('status')}, function (err, jobs) {
			if (err)
				console.log(err)

			res.send(jobs[0].status);
		});
	},

	addNote: function (req, res) {
		Job.findOne(req.param('id')).exec(function (err, job) {
			if (err)
				res.send('error');
			else {
				var notesArray = [];

				if (job.notes != null)
					notesArray = job.notes;

				var uuid = require('node-uuid');

				var noteId = uuid.v4();

				var newNote = JSON.parse('{"id":"' + noteId + '", "note":"' + req.param('note') + '", "createdAt":"' + req.param('createdAt') + '"}');

				notesArray.push(newNote);

				Job.update(job.id, {notes: notesArray}, function (err, jobs) {
					if (err)
						console.log(err);

					res.send('success');
				});
			}
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
	},

	documentUpload: function(req, res) {
		req.file('document[]').upload({
		  adapter: require('skipper-s3'),
		  key: 'AKIAJMGKEQ53X5FJMEUQ',
		  secret: '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',
		  bucket: 'docflow-dev',
		  region: 'us-west-2'
		}, function (err, files) {
	      if (err)
	        return res.serverError(err);

	      console.log(JSON.stringify(files) + '------' + JSON.stringify(files[0]));

	      Job.findOne(req.param('id')).exec(function (err, job) {
	      	if (err)
	      		console.log(err);

	      	var documents = [];
	      	if (job.documents != null)
	      		documents = documents.concat(job.documents);

	      	for (var i = 0; i < files.length; i++)
	      		documents.push(files[i].extra.Location);

	      	Job.update(req.param('id'), {documents: documents}, function (err, jobs) {
	      		if (err)
	      			res.send('Something bad happened: ' + err);

	      		res.redirect('/job/show/' + job.id);
	      	});
	      });
	  });
	}

	
};

