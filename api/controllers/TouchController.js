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

 		if (twilio.validateExpressRequest(req, 'b2f8d9837c132f73281ce615ca933952')) {
 			console.log(req.params.all());
	        var twiml = new twilio.TwimlResponse();

	        twiml.message('Your text has been received. One of our helpful concierges will respond to you as soon as possible!');

	        res.type('text/xml');
	        res.send(twiml.toString());


	    }
	    else {
	        res.send('unauthorized request');
	    }
 	},
	
};

