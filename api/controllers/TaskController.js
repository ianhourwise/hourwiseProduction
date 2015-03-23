/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
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

	create: function(req, res) {
		Task.create(req.params.all(), function (err, task) {
			res.redirect('/task/index');
		});	
	},

	index: function(req, res) {
		User.findOne(req.session.User.id).populate('tasks').exec(function (err, user) {
			var tasks = user.tasks;

			res.view({
				tasks: tasks
			});
		});
	},

	edit: function(req, res) {
		Task.findOne(req.param('id'), function (err, task) {
			res.view({
				task: task
			});
		});
	},

	update: function(req, res) {
		Task.update(req.param('id'), req.params.all(), function (err) {
			if (err)
				console.log('craparino daddy-o');

			res.redirect('/task/index');
		});
	},

	destroy: function(req, res) {
		Task.destroy(req.param('id'), function (err) {
			if (err)
				console.log('Aww jeeezeeeeee');

			res.redirect('/task/index');
		});
	}

};

