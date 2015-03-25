/**
 * TouchController
 *
 * @description :: Server-side logic for managing touches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	sendEmail: function(req, res) {
 		
 		Mandrill.sendEmail(req.params.all(), function (err) {
 			if (err) 
 				console.log(err);
 			else {
 				User.findOne({email: req.param('fromEmail')}, function (err, user) {
 					if (err)
 						console.log(err);

 					console.log(req.params.all());
 					var touchData = {
	 					type: 'email',
	 					owner: user.id,
	 					outbound: req.param('toEmail'),
	 					inbound: null,
	 					contact: null,
	 					body: req.param('body'),
	 					createdBy: req.session.User.id,
	 					job: null, //change later
	 					notes: null //change later
 					};

 					Touch.create(touchData, function (err, touch) {
 						if (err)
 							console.log(err);

 						res.redirect('user/communications');

 					});

 				});

 				
 			}
 		});
 	},

 	outboundSMS: function(req, res) {
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
	 					createdBy: req.session.User.id,
	 					job: null, //change later
	 					notes: null //change later
 					};

 					Touch.create(touchData, function (err, touch) {
 						if (err)
 							console.log(err);

 						res.redirect('user/communications');

 					});
 			}
 		});
 	},

 	inboundSMS: function(req, res) {
 		console.log('-------HIT INBOUND SMS ENDPOINT------');

 		var twilio = require('twilio');

		console.log(req.params.all());
		res.header('Content-Type', 'text/xml');

		var mediaURL = null;

		if (req.param('MediaUrl0'))
			mediaURL = req.param('MediaUrl0');

		var touchData = {
			type: 'sms',
			owner: null,
			outbound: null,
			inbound: req.param('From'),
			contact: null,
			body: req.param('Body'),
			createdBy: null,
			job: null, //change later
			notes: null, //change later
			mediaURL: mediaURL
		};

		Contact.find(function (err, contacts) {
			for (var i = 0; i < contacts.length; i++) {
				var phoneNumber = req.param('From');
				var phoneNumberTrim = phoneNumber.substring(2, phoneNumber.length); //trimming to remove +1 from phone number


				if (contacts[i].phoneNumber == phoneNumberTrim)
					touchData.contact = contacts[i].id;
			}

			Touch.create(touchData, function (err, touch) {
				if (err)
					console.log(err);

				User.find().exec( function (err, users) {
	 				for (var i = 0; i < users.length; i++) {
	 					var uuid = require('node-uuid');

						var alertId = uuid.v4();

	 					if (users[i].role == 'superUser' || users[i].role == 'concierge') {
	 						users[i].addAlert(touch.inbound + ' just sent in a text message.', alertId);
	 						User.publishUpdate(users[i].id, { message: touch.inbound + ' just sent in a text message.', id: alertId });
	 						console.log('---------SHOULD BE PUBLISHING UPDATE----------');
	 					}
	 					
	 				}

	 				res.send('<Response><Message>Your text has been received. One of our helpful concierges will respond to you as soon as possible!</Message></Response>'); 
							
	 			});
			});
		});

 	},
	
};

