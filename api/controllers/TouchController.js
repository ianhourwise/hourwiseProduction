/**
 * TouchController
 *
 * @description :: Server-side logic for managing touches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	sendEmail: function(req, res) {
		console.log(req.params.all());
 		
 		Mandrill.sendEmail(req.params.all(), function (err) {
 			if (err) 
 				console.log(err);
 			else {
 				User.findOne({email: req.param('fromEmail')}, function (err, user) {
 					if (err)
 						console.log(err);

 					//console.log(req.params.all());
 					var contact = null;
 					Contact.find().exec(function (err, contacts) {
 						if (err)
 							console.log(err);

 						for (var i = 0; i < contacts.length; i++)
 							if (contacts[i].email && req.param('toEmail') == contacts[i].email) {
 								contact = contacts[i].id;
 								break;
 							}

 						var job = null;
 						if (req.param('jobId'))
							job = req.param('jobId');	

 						var touchData = {
		 					type: 'email',
		 					owner: user.id,
		 					outbound: req.param('toEmail'),
		 					inbound: null,
		 					contact: null,
		 					body: req.param('body'),
		 					createdBy: req.session.User.id,
		 					job: job, //change later
		 					notes: null //change later
	 					};

	 					Touch.create(touchData, function (err, touch) {
	 						if (err)
	 							console.log(err);

	 						if (req.param('jobId'))
	 							res.send('Got it!');
	 						else
								res.redirect('user/communications');

	 					});
 					});
 				});

 				
 			}
 		});
 	},

 	outboundSMS: function(req, res) {
 		//console.log(req.param('toNumber'));
 		console.log(req.param('body'));
 		Twilio.sendSMS({toNumber: req.param('toNumber'), smsContent: req.param('body')}, function (err) {
 			if (err) 
 				console.log(err);
 			else {
 				var touchData = {
	 					type: 'sms',
	 					owner: null,
	 					outbound: req.param('toNumber'),
	 					inbound: null,
	 					contact: null,
	 					body: req.param('body'),
	 					createdBy: req.session.User.username,
	 					job: null, //change later
	 					notes: null,
	 					owner: null //change later
 					};

 			
 					formattedNumber = '+1' + req.param('toNumber');

 					//console.log(formattedNumber);	

 					Communication.findOne({primaryNumber: formattedNumber}).exec(function (err, communication) {

 						if (err)
 							console.log(err);

 						if (communication != null) {
 							touchData.owner = communication.id;

	 						Touch.create(touchData, function (err, touch) {
		 						if (err)
		 							console.log(err);

		 						if (req.param('fromPost'))
		 							res.send('Nice! Got it!');
		 						else
		 							res.redirect('user/communications');

		 					});
 						}
 						else {
 							Communication.create({primaryNumber: formattedNumber}, function (err, newCommunication) {
 								touchData.owner = newCommunication.id;

		 						Touch.create(touchData, function (err, touch) {
			 						if (err)
			 							console.log(err);

			 						if (req.param('fromPost'))
		 								res.send('Nice! Got it!');
		 							else
			 							res.redirect('user/communications');

			 					});
 							});
 						}
 						
 					});

 					
 			}
 		});
 	},

 	outboundJobSMS: function(req, res) {
 		console.log(req.param('body'));
 		Twilio.sendSMS({toNumber: req.param('toNumber'), smsContent: req.param('body')}, function (err) {
 			if (err) 
 				console.log(err);
 			else {

 				var touchData = {
					type: 'sms',
					owner: null,
					outbound: req.param('toNumber'),
					inbound: null,
					contact: req.param('contactId'),
					body: req.param('body'),
					createdBy: req.session.User.username,
					job: req.param('jobId'), 
					notes: null,
					owner: null //change later
				};

		
				formattedNumber = '+1' + req.param('toNumber');
				
				Touch.create(touchData, function (err, touch) {
					if (err)
						console.log(err);

					if (req.param('fromPost'))
						res.send('Nice! Got it!');
					else
						res.redirect('user/communications');

				});
 			}
 		});
 	},

 	testCall: function (req, res) {
 		Twilio.makeCall({}, function(err) {
 			//console.log('--call was made');
 			res.redirect('user/communications');
 		});
 	},

 	inboundSMS: function(req, res) {
 		//console.log('-------HIT INBOUND SMS ENDPOINT------');

 		var twilio = require('twilio');

		//console.log(req.params.all());
		res.header('Content-Type', 'text/xml');

		var mediaURL = null;
		var body = 'No body provided';

		if (req.param('MediaUrl0'))
			mediaURL = req.param('MediaUrl0');

		if (req.param('Body'))
			body = req.param('Body');

		var touchData = {
			type: 'sms',
			owner: null,
			outbound: null,
			inbound: req.param('From'),
			contact: null,
			body: body,
			createdBy: null,
			job: null, //change later
			notes: null, //change later
			mediaURL: mediaURL,
			owner: null
		};

		Contact.find(function (err, contacts) {
			for (var i = 0; i < contacts.length; i++) {
				var phoneNumber = req.param('From');
				var phoneNumberTrim = phoneNumber.substring(2, phoneNumber.length); //trimming to remove +1 from phone number


				if (contacts[i].phoneNumber == phoneNumberTrim)
					touchData.contact = contacts[i].id;
			}

			Communication.findOne({primaryNumber: req.param('From')}).exec(function (err, communication) {
 						
				if (err)
					console.log(err);

				if (communication != null) {
					touchData.owner = communication.id;

					Touch.create(touchData, function (err, touch) {
						if (err)
							console.log(err);

						User.find().exec(function (err, users) {
							if (err)
								console.log(err)

							var showName = false;
							var name = '';
							var email = '1'

							for (var i = 0; i < users.length; i++) 
								if (users[i].primaryNumber != null)
									if (users[i].primaryNumber == communication.primaryNumber) {
										showName = true;
										name = users[i].username;
										email = users[i].email;
										break;
									}
							if (showName) {
								var ticket = {
									'subject': 'TXT from ' + name + ' for Hourwise/Foundation',
									'description': touch.body,
									'requester': email,
									'mediaUrl': mediaUrl
								};
							}
							else {
								var ticket = {
									'subject': 'TXT from ' + touch.inbound + ' for Hourwise/Foundation',
									'description': touch.body,
									'requester': email,
									'mediaUrl': mediaUrl
								};
							}		
							

							Zendesk.createTicket(ticket);
							
			 				for (var i = 0; i < users.length; i++) {
			 					var uuid = require('node-uuid');

								var alertId = uuid.v4();

			 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
			 						if (showName) {
			 							users[i].addAlert(name + ' just sent in a text message.', alertId, communication.id, false);
			 							User.publishUpdate(users[i].id, { message: name + ' just sent in a text message.', id: alertId, communicationId: communication.id  });
			 						}
			 						else {
			 							users[i].addAlert(touch.inbound + ' just sent in a text message.', alertId, communication.id, false);
			 							User.publishUpdate(users[i].id, { message: touch.inbound + ' just sent in a text message.', id: alertId, communicationId: communication.id  });
			 						}
			 						
			 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
			 					}
			 					
			 				}

			 				res.send('<Response></Response>'); 
									
			 			});
					});
				}
				else {
					Communication.create({primaryNumber: req.param('From')}, function (err, newCommunication) {
						touchData.owner = newCommunication.id;

						Touch.create(touchData, function (err, touch) {
							if (err)
								console.log(err);

							var ticket = {
								'subject': 'TXT from ' + touch.inbound + 'for Hourwise/Foundation',
								'description': touch.body,
							};

							Zendesk.createTicket(ticket);

							User.find().exec( function (err, users) {
				 				for (var i = 0; i < users.length; i++) {
				 					var uuid = require('node-uuid');

									var alertId = uuid.v4();

				 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
				 						users[i].addAlert(touch.inbound + ' just sent in a text message.', alertId, newCommunication.id, false);
				 						User.publishUpdate(users[i].id, { message: touch.inbound + ' just sent in a text message.', id: alertId, communicationId: communication.id  });
				 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
				 					}
				 					
				 				}

				 				res.send('<Response></Response>'); 
										
				 			});
						});
					});
				}
			});
		});

 	},

 	inboundSimulation: function(req, res) {
 		var mediaURL = null;

		// if (req.param('MediaUrl0'))
		// 	mediaURL = req.param('MediaUrl0');

		var touchData = {
			type: 'sms',
			owner: null,
			outbound: null,
			inbound: '+17578807276',
			contact: null,
			body: 'Cool, got it!',
			createdBy: null,
			job: null, //change later
			notes: null, //change later
			mediaURL: mediaURL,
			owner: null
		};

		Contact.find(function (err, contacts) {
			for (var i = 0; i < contacts.length; i++) {
				var phoneNumber = req.param('From');
				var phoneNumberTrim = phoneNumber.substring(2, phoneNumber.length); //trimming to remove +1 from phone number


				if (contacts[i].phoneNumber == phoneNumberTrim)
					touchData.contact = contacts[i].id;
			}

			Communication.findOne({primaryNumber: touchData.inbound}).exec(function (err, communication) {
 						
				if (err)
					console.log(err);

				if (communication != null) {
					touchData.owner = communication.id;

					Touch.create(touchData, function (err, touch) {
						if (err)
							console.log(err);

						var ticket = {
							'subject': 'TXT from ' + touch.inbound + 'for Hourwise/Foundation',
							'description': touch.body,
						};

						//Zendesk.createTicket(ticket);

						User.find().exec( function (err, users) {
			 				for (var i = 0; i < users.length; i++) {
			 					var uuid = require('node-uuid');

								var alertId = uuid.v4();

			 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
			 						users[i].addAlert(touch.inbound + ' just sent in a text message.', alertId, communication.id);
			 						User.publishUpdate(users[i].id, { message: touch.inbound + ' just sent in a text message.', id: alertId, communicationId: communication.id });
			 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
			 					}
			 					
			 				}

			 				//res.send('<Response></Response>'); 
									
			 			});
					});
				}
				else {


					Communication.create({primaryNumber: touchData.inbound}, function (err, newCommunication) {
						touchData.owner = newCommunication.id;

						Touch.create(touchData, function (err, touch) {
							if (err)
								console.log(err);

							var ticket = {
								'subject': 'TXT from ' + touch.inbound + 'for Hourwise/Foundation',
								'description': touch.body,
							};

							//Zendesk.createTicket(ticket);

							User.find().exec( function (err, users) {
				 				for (var i = 0; i < users.length; i++) {
				 					var uuid = require('node-uuid');

									var alertId = uuid.v4();

				 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
				 						users[i].addAlert(touch.inbound + ' just sent in a text message.', alertId, newCommunication.id);
				 						User.publishUpdate(users[i].id, { message: touch.inbound + ' just sent in a text message.', id: alertId, communicationId: newCommunication.id });
				 						//console.log('---------SHOULD BE PUBLISHING UPDATE----------');
				 					}
				 					
				 				}

				 				//res.send('<Response></Response>'); 
										
				 			});
						});
					});
				}
			});
		});
 	// 	User.find().exec( function (err, users) {
		// 	for (var i = 0; i < users.length; i++) {
		// 		var uuid = require('node-uuid');

		// 		var alertId = uuid.v4();

		// 		if (users[i].role == 'superUser' || users[i].role == 'concierge') {
		// 			users[i].addAlert('+17578807276' + ' just sent in a text message.', alertId);
		// 			User.publishUpdate(users[i].id, { message: '+17578807276' + ' just sent in a text message.', id: alertId });
		// 			console.log('---------SHOULD BE PUBLISHING UPDATE----------');
		// 		}
		// 	}
		// });
 	}
 };

