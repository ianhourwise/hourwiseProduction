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
	},

	zendeskTrigger: function(req, res) {
		console.log('-------------ZENDESK TRIGGER-----------');
		console.log(req.param('payload'));

		var ticket = JSON.parse(req.param('payload'));
		console.log(ticket.id);

		Zendesk.findTicket(ticket.id, function (ticket) {
			console.log('made it back ' + JSON.stringify(ticket));

			Task.findOne({zendesk: {id: ticket.id}}, function (err, existingTicket) {
				if (err)
					console.log(err);

				if (existingTicket == null) {
					Task.create({zendesk: ticket, type: 'zendesk'}, function (err, newTicket) {
						if (err)
							console.log(err);

						res.send(200);
					});
				}
				else {
					console.log('updating ticket...');
					Ticket.update({id: ticket.id}, {zendesk: ticket}, function (err) {
						if (err)
							console.log(err);

						res.send(200);
					});
				}
			});
		});
	},

	grabTickets: function(req, res) {
		 Zendesk.listTickets(function (tickets) {
                function asyncLoop(iterations, func, callback) {
                    var index = 0;
                    var done = false;
                    var loop = {
                        next: function() {
                            if (done) {
                                return;
                            }

                            if (index < iterations) {
                                index++;
                                func(loop);

                            } else {
                                done = true;
                                callback();
                            }
                        },

                        iteration: function() {
                            return index - 1;
                        },

                        break: function() {
                            done = true;
                            callback();
                        }
                    };
                    loop.next();
                    return loop;
                }

                var ticketIndex = 0;    

                asyncLoop(tickets.length, function (loop) {
                    Task.create({zendesk: tickets[ticketIndex], type: 'zendesk'}, function (err, ticket) {
                        console.log('^.^');
                        ticketIndex++;
                        console.log(loop.iteration());
                        loop.next();
                    })
                    },
                    function() {console.log('cycle ended')}
                );      
            });
	}

};

