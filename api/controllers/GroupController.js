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
		Group.findOne(req.param('id')).populate('contacts').exec(function (err, group) {
			Contact.find(function (err, contacts) {
				
				if (group.contacts.length > 0) {
					var groupContacts = group.contacts;

					for (var i = 0; i < groupContacts.length; i++) {
						for (var j = 0; j < contacts.length; j++) {
							if (groupContacts[i].id == contacts[j].id)
								contacts.splice(j, 1);
						}
					}
				}

				var existingGroupContacts = group.contacts;
				
				res.view({
					group: group,
					contacts: contacts,
					existingGroupContacts: existingGroupContacts
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
					console.log(err);

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
		});
	},

	create: function(req, res) {

		var contacts = [];

		if (req.param('addUser') != 0)
			contacts = req.param('addUser');


		Group.create({'name': req.param('name'), 'address': req.param('address'), 'contacts': contacts, 'company': req.session.User.company}, function (err, group) {

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

