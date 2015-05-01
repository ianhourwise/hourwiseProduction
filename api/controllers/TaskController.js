/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res) {
		User.find().exec(function (err, users) {
			res.locals.layout = "layouts/layout"; 
			res.view({
				users: users,
				user: req.session.User
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
		if (req.param('fromDropdown')) {
			var date = new Date();
			if (date.getMonth() < 9)
				var dateString = date.getFullYear() + '-0' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate();
			else
				var dateString = date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate();

			Task.update(req.param('id'), {completedOn: dateString}, function (err, tasks) {
				if (err)
					console.log('craparino daddy-o');

				User.findOne({id: tasks[0].owner}).populate('tasks').exec(function (err, user) {
					req.session.User = user;

					res.redirect('/task/index');
				});
			});
		}
		else {
			Task.update(req.param('id'), req.params.all(), function (err) {
				if (err)
					console.log('craparino daddy-o');

				res.redirect('/task/index');
			});
		}
		
	},

	destroy: function(req, res) {
		Task.destroy(req.param('id'), function (err) {
			if (err)
				console.log('Aww jeeezeeeeee');

			res.redirect('/task/index');
		});
	},

	getTicketsForUser: function(req, res) {
		Zendesk.listTicketsByUserId(req.param('zendeskId'), function (tickets) {
			console.log(tickets);
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

            var commentsArray = [];

            var commentIndex = 0;

            //limit tickets only tickets that are in iOS land 
            var iOSTickets = [];

            for (var i = 0; i < tickets.length; i++)
            	if (tickets[i].raw_subject.indexOf('+') > -1 )
            		iOSTickets.push(tickets[i]);

            console.log('IOS TICKET LENGTH: ' + iOSTickets.length)

            asyncLoop(iOSTickets.length, function (loop) {
            	Zendesk.getCommentsForTicket(iOSTickets[commentIndex].id, function (err, comments) {
            		if (err == null) {
            			console.log(JSON.stringify(comments));

	            		commentsArray.push({comments: comments, subjectId: iOSTickets[commentIndex].raw_subject});

	            		console.log('COMMENT INDEX: ' + commentIndex);

	            		commentIndex++;

	            		loop.next();
            		}
            		else {
            			commentIndex++;

	            		loop.next();
            		}	
            	});
                },
                function() {
                	console.log('Hopefully got all the comments for all the tickets...');
                	console.log('After aysnc loop ------- ' + JSON.stringify(commentsArray[0]));

                	res.send({"tickets": iOSTickets, "comments": commentsArray});
                }
            ); 
		});
	},

	zendeskTrigger: function(req, res) {
		//console.log('-------------ZENDESK TRIGGER-----------');
		//console.log(req.param('payload'));

		var ticket = JSON.parse(req.param('payload'));
		//console.log(ticket.id);

		Zendesk.findTicket(ticket.id, function (ticket, comments) {

			var passComments = null

			if (comments != null)
				passComments = comments[0];

			if (ticket != null) {
				Task.findOne({zendeskId: ticket.id.toString()}, function (err, existingTicket) {
					if (err)
						console.log(err);

					User.find().exec(function (err, users) {
						if (err)
							console.log(err);

						if (existingTicket == null) {
							console.log('creating ticket...');
							User.findOne({zendeskId: ticket.requester_id.toString()}, function (err, user) {
								var userId = null;

								if (user != null)
									userId = user.id;

								Task.create({zendesk: ticket, type: 'zendesk', zendeskId: ticket.id, requester: userId}, function (err, newTicket) {
									if (err)
										console.log(err);

									// for (var i = 0; i < users.length; i++) {
					 			// 		var uuid = require('node-uuid');

									// 	var alertId = uuid.v4();

					 			// 		if (users[i].role == 'superUser' || users[i].role == 'concierge') {
					 						
					 						//users[i].addAlert('New ticket: ' + newTicket.zendesk.raw_subject, alertId, newTicket.zendesk.id, true);
					 						//User.publishUpdate(users[i].id, { message: 'New ticket: ' + newTicket.zendesk.raw_subject, id: alertId, communicationId: newTicket.zendesk.id, fromTask: true  });
					 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
					 				// 	}
					 					
					 				// }

									res.send(200);
								});
							});
						}

						else {
							console.log('updating ticket...');
							var assigneeId = null;

							if (ticket.assignee_id != null)
								assigneeId = ticket.assignee_id.toString();

							User.findOne({zendeskId: assigneeId}, function (err, user) {
								var userId = null;

								if (user != null)
									userId = user.id;

								Task.update({id: existingTicket.id}, {zendesk: ticket, owner: userId}, function (err, tickets) {
									if (err)
										console.log(err);

									//for (var i = 0; i < users.length; i++) {
						 					//var uuid = require('node-uuid');

											//var alertId = uuid.v4();

						 					//if (users[i].role == 'superUser' || users[i].role == 'concierge') {
						 						//users[i].addAlert('Updated ticket: ' + tickets[0].zendesk.raw_subject, alertId, tickets[0].zendesk.id, true);
					 							//User.publishUpdate(users[i].id, { message: 'Updated ticket: ' + tickets[0].zendesk.raw_subject, id: alertId, communicationId: tickets[0].zendesk.id, fromTask: true  });
						 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
						 					//}
						 					
						 				//}
						 			var commentArray = passComments.comments;
						 			var passCommentArray = [];
						 			
						 			for (var i = 0; i < commentArray.length; i++) 
						 				if (commentArray[i].attachments.length <= 0)
						 					passCommentArray.push(commentArray[i].body)

						 			if (tickets[0].zendesk.status == 'closed' && tickets[0].zendesk.custom_fields[2].value != null && tickets[0].zendesk.organization_id != null) 
						 				NutshellApi.newNote(tickets[0].zendesk.custom_fields[2].value, tickets[0].zendesk.organization_id, tickets[0].zendeskId);
						 				
						 				
						 			sails.sockets.broadcast(tickets[0].zendesk.requester_id, 'task', {subject: tickets[0].zendesk.raw_subject, status: tickets[0].zendesk.status, comments: passCommentArray });

									res.send(200);
									
								});
							});
						}
					});
				});
			}
		});
	},

	testNutshellComment: function(req, res) {
		NutshellApi.newNote('2994', 40631486, '9520');
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

