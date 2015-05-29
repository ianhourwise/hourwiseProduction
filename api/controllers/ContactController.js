/**
 * ContactController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res) {

		User.findOne(req.session.User.id).populate('company').exec(function (err, user) {
			res.locals.layout = "layouts/layout"; 
			res.view({
				user: user
			});
		});
	},

	index: function(req, res) {
		Contact.find( function (err, contacts) {
			res.locals.layout = "layouts/layout";
			res.view({
				contacts: contacts
			});
		});
	},
	
	edit: function(req, res) {
		Contact.findOne(req.param('id')).populate('groups').exec(function (err, contact) {
			res.view({
				contact: contact,
				groups: contact.groups
			});
		});
	},

	update: function(req, res) {
		Contact.update(req.param('id'), req.params.all(), function (err) {
			if (err)
				console.log('craparino daddy-o');

			res.redirect('/contact/index');
		});
	},

	create: function(req, res) {
		console.log('hitting controller');
		console.log(req.params.all());
		Contact.create(req.params.all(), function (err, contact) {
			if (req.param('fromJobCreate')) {
				console.log('should send contact');
				res.send(contact);
			}	
			else {
				console.log('why are you hitting this');
				res.redirect('/contact/index');
			}
				
		});	
	},

	destroy: function(req, res) {
		Contact.destroy(req.param('id'), function (err) {
			if (err)
				console.log('Aww jeeezeeeeee');

			res.redirect('/contact/index');
		});
	}
};

