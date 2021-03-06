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
		//var endDate = new Date();
		//endDate.setSeconds(endDate.getSeconds() + 10);

		Task.create(req.params.all(), function (err, task) {

			//scheduler.schedule(endDate, 'taskDueTrigger', task);

			//schedule and store incase server goes down
			//scheduler.scheduleAndStore(endDate, 'taskDueTrigger', task, function(err) {

			//});
			if (req.param('fromJobShow'))
				res.send(task);
			else
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

	completeTask: function(req, res) {
		Task.update(req.param('id'), {completed: true}, function (err, tasks) {
			if (err)
				console.log(err);

			res.send('updated');
		});
	},

	reporting: function(res, res) {
		var date = new Date();
		date.setDate(date.getDate() - (date.getDate() - 1));
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMonth(date.getMonth() - 1);

		var endDate = new Date();
		endDate.setDate(date.getDate() - (date.getDate() - 1));
		endDate.setHours(0);
		endDate.setMinutes(0);
		endDate.setSeconds(0);

		var ticketQuery = Task.find();
		ticketQuery.where({type: 'zendesk', createdAtOriginal: {'>=': date, '<=': endDate}});

		ticketQuery.exec(function (err, tickets) {
			if (err)
				console.log(err);

			Company.find().populate('employees').exec(function (err, companies) {
				if (err)
					console.log(err);

				var date = new Date();
				date.setDate(date.getDate() - (date.getDate() - 1));
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);

				var ticketQuery = Task.find();
				ticketQuery.where({type: 'zendesk', createdAtOriginal: {'>=': date}});

				ticketQuery.exec(function (err, currentTickets) {
					res.locals.layout = "layouts/reportingLayout"; 

					res.view({
						lastTickets: tickets,
						companies: companies,
						currentTickets: currentTickets
					});
				});
			});	
		});
	},

	getTicketsSinceLast: function (req, res) {
		var ticketQuery = Task.find();
		ticketQuery.where({type: 'zendesk'});

		ticketQuery.exec(function (err, tickets) {
			if (err)
				throw (err);

			var dateInSeconds = new Date(tickets[tickets.length - 1].createdAt) / 1000;
			dateInSeconds = Math.round(dateInSeconds);

			Zendesk.exportTicketsSince(dateInSeconds, function(tickets1) {

				var ticketIds = [];

				for (var i = 0; i < tickets1.results.length; i++)
						ticketIds.push(tickets1.results[i].id);

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

	                asyncLoop(ticketIds.length, function (loop) {
	                	Zendesk.findTicket(ticketIds[ticketIndex], function (ticket, comments) {
	                		console.log(ticket)
	                		if (ticket != undefined) {
	                			if (ticket.assignee_id != null) {
			                		User.findOne({zendeskId: ticket.assignee_id.toString()}, function (err, assignee) {
			                			var assigneeId = null;

			                			if (assignee != null)
			                				assigneeId = assignee.id;

			                			User.findOne({zendeskId: ticket.requester_id.toString()}, function (err, requester) {
			                				var requesterId = null;

			                				if (requester != null)
			                					requesterId = requester.id;

			                				ticketIndex++;
						                        console.log(loop.iteration());
						                        loop.next();
			                			});
			                		});
			                	}
			                    else {
			                    	User.findOne({zendeskId: ticket.requester_id.toString()}, function (err, requester) {
			                				var requesterId = null;

			                				if (requester != null)
			                					requesterId = requester.id;

			                				ticketIndex++;
						                        console.log(loop.iteration());
						                        loop.next();
			                			});
			                    }
	                		}
	                		else {
	                			ticketIndex++;
		                        console.log(loop.iteration());
		                        loop.next();
	                		}
	                	});		

                	
	                    },

	                    function() {
	                    	console.log('cycle ended')
	                    	res.send(200);
        				}
	                );      
	            
					
				});
			});
		// });
	},

	getTicketById: function (req, res) {
			},

	getTicketsForUser: function(req, res) {
		Zendesk.listTicketsByUserId(req.param('zendeskId'), function (tickets) {
			//console.log(tickets);
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

                    break: function() {t
                        done = true;t
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

            //console.log('IOS TICKET LENGTH: ' + iOSTickets.length)

            asyncLoop(iOSTickets.length, function (loop) {
            	Zendesk.getCommentsForTicket(iOSTickets[commentIndex].id, function (err, comments) {
            		if (err == null) {
            			//console.log(JSON.stringify(comments));

	            		//commentsArray.push({comments: comments, subjectId: iOSTickets[commentIndex].raw_subject});

	            		//console.log('COMMENT INDEX: ' + commentIndex);

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
                	//console.log('Hopefully got all the comments for all the tickets...');
                	//console.log('After aysnc loop ------- ' + JSON.stringify(commentsArray[0]));

                	res.send({"tickets": iOSTickets, "comments": commentsArray});
                }
            ); 
		});
	},

	zendeskTrigger: function(req, res) {
		var ticket = JSON.parse(req.param('payload'));

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
							User.findOne({zendeskId: ticket.requester_id.toString()}, function (err, user) {
								var userId = null;

								if (user != null)
									userId = user.id;

								Task.create({zendesk: ticket, type: 'zendesk', zendeskId: ticket.id, requester: userId}, function (err, newTicket) {
									if (err)
										console.log(err);

									res.send(200);
								});
							});
						}

						else {
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

						 			var commentArray = passComments.comments;
						 			var passCommentArray = [];
						 			
						 			for (var i = 0; i < commentArray.length; i++) 
						 				if (commentArray[i].attachments.length <= 0)
						 					passCommentArray.push(commentArray[i].body)

						 				/*COMMENTING OUT FROM STAGING*/

						 			if (tickets[0].zendesk.status == 'closed' && tickets[0].zendesk.custom_fields[2].value != null && tickets[0].zendesk.organization_id != null) 
						 				NutshellApi.newNote(tickets[0].zendesk.custom_fields[2].value, tickets[0].zendesk.organization_id, tickets[0].zendeskId);
						 				
						 				
						 			//sails.sockets.broadcast(tickets[0].zendesk.requester_id, 'task', {subject: tickets[0].zendesk.raw_subject, status: tickets[0].zendesk.status, comments: passCommentArray });

									res.send(200);
									
								});
							});
						}
					});
				});
			}
		});
	},

	grabTickets: function(req, res) {
		 Zendesk.listAllTickets(function (tickets) {
		 	console.log(tickets.length)
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

                				Task.create({zendesk: tickets[ticketIndex], type: 'zendesk', zendeskId: tickets[ticketIndex].id, owner: assigneeId, requester: requesterId, createdAtOriginal: new Date(tickets[ticketIndex].created_at)}, function (err, ticket) {
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

                				Task.create({zendesk: tickets[ticketIndex], type: 'zendesk', zendeskId: tickets[ticketIndex].id, requester: requesterId, createdAtOriginal: new Date(tickets[ticketIndex].created_at)}, function (err, ticket) {
			                        ticketIndex++;
			                        console.log(loop.iteration());
			                        loop.next();
			                    })
                			});
                    }
                    },

                    function() {
                    	console.log('cycle ended')
    				}
                );      
            });
	},

	referenceTest: function (req, res) {
		var array = ['16926', '16983', '16918', '17025'];
		//console.log(Zendesk);

		sails.services.zendesk.findTickets(array, false, function (tickets) {
			sails.services.zendesk.findTickets(array, true, function (tickets) {
				console.log('made it back');
				res.send(200);
			})
		});
	},

	pullOrganization: function (req, res) {
		Zendesk.pullOrganizations();
	}

};

