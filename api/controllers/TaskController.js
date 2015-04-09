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
			//console.log('made it back ' + JSON.stringify(ticket));

			Task.findOne({zendeskId: ticket.id}, function (err, existingTicket) {
				if (err)
					console.log(err);

				User.find().exec(function (err, users) {
					if (err)
						console.log(err);

					if (existingTicket == null) {
						console.log('creating ticket...');
						Task.create({zendesk: ticket, type: 'zendesk', zendeskId: ticket.id}, function (err, newTicket) {
							if (err)
								console.log(err);

							for (var i = 0; i < users.length; i++) {
			 					var uuid = require('node-uuid');

								var alertId = uuid.v4();

			 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
			 						users[i].addAlert('New ticket: ', newTicket.raw_subject);
			 						User.publishUpdate(users[i].id, { message: 'New ticket: ' + newTicket.raw_subject, id: alertId, communicationId: newTicket.url, fromTask: true  });
			 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
			 					}
			 					
			 				}

							res.send(200);
						});
					}
					else {
						console.log('updating ticket...');
						Task.update({id: existingTicket.id}, {zendesk: ticket}, function (err, tickets) {
							if (err)
								console.log(err);

							for (var i = 0; i < users.length; i++) {
				 					var uuid = require('node-uuid');

									var alertId = uuid.v4();

				 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
				 						users[i].addAlert('Updated ticket: ', tickets[0].raw_subject);
			 							User.publishUpdate(users[i].id, { message: 'Updated ticket: ' + tickets[0].raw_subject, id: alertId, communicationId: tickets[0].url, fromTask: true  });
				 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
				 					}
				 					
				 				}

							res.send(200);
						});
					}
				});
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
                    Task.create({zendesk: tickets[ticketIndex], type: 'zendesk', zendeskId: tickets[ticketIndex].id}, function (err, ticket) {
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

