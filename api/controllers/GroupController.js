/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res) {
		Contact.find(function (err, contacts) {
			if (err)
				console.log('Bug alert!!!')

			res.locals.layout = "layouts/layout"; 
				res.view({
					contacts: contacts
				}); 
		});
	},

	index: function(req, res) {
		Group.find(function (err, groups) {
			if (err)
				console.log('Why\'d you fail???');

			res.view({
				groups: groups
			});
		});
	},

	edit: function(req, res) {
		Group.findOne(req.param('id'), function (err, group) {
			Contact.find(function (err, contacts) {
				res.view({
					group: group,
					contacts: contacts
				});
			});
		});
	},

	update: function(req, res) {
		Group.findOne(req.param('id'), function (err, group) {
			var name = req.param('name');
			var address = req.param('address');

			var contacts = group.contacts;

			if (req.param('addUser') != 0) 
				contacts.push(req.param('addUser'));

			Group.update(req.param('id'), {'name': name, 'address': address, 'contacts': contacts}, function (err) {
				if (err)
					console.log('craparino daddy-o');

				if (req.param('id') != 0) {
					Contact.findOne(req.param('addUser'), function (err, contact) {
						var groups = contact.groups;

						groups.push(group.id);

						Contact.update(contact.id, {groups: groups}, function (err) {
							res.redirect('/group/index');
						});
					});
				}
				else
					res.redirect('/group/index');
			});
		});
	},

	create: function(req, res) {
		var contact = null;

		if (req.param('addUser') != 0)
			contact = req.param('addUser');


		Group.create({'name': req.param('name'), 'address': req.param('address'), 'contacts': contact}, function (err, group) {

			if (req.param('addUser') != 0) {
				Contact.findOne(req.param('addUser'), function (err, contact) {
					var groups = contact.groups;

					groups.push(group.id);

					Contact.update(contact.id, {groups: groups}, function (err) {
						res.redirect('/group/index');
					});
				}); 
			}
			else
				res.redirect('/group/index');
			
		});	
	},

	destroy: function(req, res) {
		Group.destroy(req.param('id'), function (err) {
			if (err)
				console.log('Aww jeeezeeeeee');

			res.redirect('/group/index');
		});
	}

};

