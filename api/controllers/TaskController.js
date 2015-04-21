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

	getTicketsForUser: function(req, res) {
		Zendesk.listTicketsByUserId(req.param(), function (tickets) {
			console.log(tickets);
		});
	},

	subscribe: function(req, res) {
		Zendesk.findTicket(8034, function (ticket) {
			var zendeskId = "12345"

			sails.sockets.broadcast(zendeskId, 'task', { msg: 'Incoming ticket update', ticket: ticket });
		});
		
	},

	subscribeToTasks: function(req, res) {
			var socket = req.socket;
			console.log('_+_+_+_+_+_+_+' + socket.sid + '_+_+_+_+_+_+_+_+_+_+_');
			sails.sockets.emit(socket, "task", {msg: "please work"});
			console.log('--------______--------HITTING THIS??????------_______-------')
			var zendeskId = 1234
			Task.subscribe(req.socket, zendeskId);
			//User.publishUpdate(users[i].id, { message: 'hello there!' });
			Task.publishUpdate(zendeskId, { message: 'Hope this works!!!'} )
			console.log('Mobile subscribed to task events');
	},

	zendeskTrigger: function(req, res) {
		//console.log('-------------ZENDESK TRIGGER-----------');
		//console.log(req.param('payload'));

		var ticket = JSON.parse(req.param('payload'));
		//console.log(ticket.id);

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
						User.findOne({zendeskId: ticket.requester_id}, function (err, user) {
							var userId = null;

							if (user != null)
								userId = user.id;

							Task.create({zendesk: ticket, type: 'zendesk', zendeskId: ticket.id, requester: userId}, function (err, newTicket) {
								if (err)
									console.log(err);

								for (var i = 0; i < users.length; i++) {
				 					var uuid = require('node-uuid');

									var alertId = uuid.v4();

				 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
				 						users[i].addAlert('New ticket: ' + newTicket.zendesk.raw_subject, alertId, newTicket.zendesk.id, true);
				 						User.publishUpdate(users[i].id, { message: 'New ticket: ' + newTicket.zendesk.raw_subject, id: alertId, communicationId: newTicket.zendesk.id, fromTask: true  });
				 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
				 					}
				 					
				 				}
				 				sails.sockets.broadcast(newTicket.zendesk.requester_id, 'task', { msg: 'Incoming ticket update', ticket: newTicket.zendesk });

								res.send(200);
							});
						});
					}
					else {
						console.log('updating ticket...');
						var assigneeId = null;

						if (ticket.assignee_id != null)
							assigneeId = ticket.assignee_id;

						User.findOne({zendeskId: assigneeId}, function (err, user) {
							var userId = null;

							if (user != null)
								userId = user.id;

							Task.update({id: existingTicket.id}, {zendesk: ticket, owner: userId}, function (err, tickets) {
								if (err)
									console.log(err);

								for (var i = 0; i < users.length; i++) {
					 					var uuid = require('node-uuid');

										var alertId = uuid.v4();

					 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
					 						users[i].addAlert('Updated ticket: ' + tickets[0].zendesk.raw_subject, alertId, tickets[0].zendesk.id, true);
				 							User.publishUpdate(users[i].id, { message: 'Updated ticket: ' + tickets[0].zendesk.raw_subject, id: alertId, communicationId: tickets[0].zendesk.id, fromTask: true  });
					 						console.log('---------SHOULD BE PUBLISHING UPDATE----------');
					 					}
					 					
					 				}
					 			sails.sockets.broadcast(tickets[0].zendesk.requester_id, 'task', { msg: 'Incoming ticket update', ticket: tickets[0].zendesk });

								res.send(200);
								
							});
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
                	if (tickets[ticketIndex].assignee_id != null) {
                		User.findOne({zendeskId: tickets[ticketIndex].assignee_id.toString()}, function (err, assignee) {
                			var assigneeId = null;

                			if (assignee != null)
                				assigneeId = assignee.id;

                			User.findOne({zendeskId: tickets[ticketIndex].requester_id.toString()}, function (err, requester) {
                				var requesterId = null;

                				if (requester != null)
                					requesterId = requester.id;

                				Task.create({zendesk: tickets[ticketIndex], type: 'zendesk', zendeskId: tickets[ticketIndex].id, owner: assigneeId, requester: requesterId}, function (err, ticket) {
			                        ticketIndex++;
			                        console.log(loop.iteration());
			                        loop.next();
			                    })
                			});
                		});
                	}
                    else {
                    	User.findOne({zendeskId: tickets[ticketIndex].requester_id.toString()}, function (err, requester) {
                				var requesterId = null;

                				if (requester != null)
                					requesterId = requester.id;

                				Task.create({zendesk: tickets[ticketIndex], type: 'zendesk', zendeskId: tickets[ticketIndex].id, requester: requesterId}, function (err, ticket) {
			                        ticketIndex++;
			                        console.log(loop.iteration());
			                        loop.next();
			                    })
                			});
                    }
                    },

                    function() {console.log('cycle ended')}
                );      
            });
	}

};

