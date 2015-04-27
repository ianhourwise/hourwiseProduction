module.exports = {
	sendSMS: function(data, callback) {
		var twilio = require('twilio');

		var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

		client.sms.messages.create({
		    to:'+1' + data.toNumber,
		    from: process.env.TWILIO_NUMBER, //change later? Not sure just found it in the account
		    body: data.smsContent
		}, function(error, message) {
		    if (!error) {
		        console.log('Success! The SID for this SMS message is:');
		        console.log(message.sid);
		 
		        console.log('Message sent on:');
		        console.log(message.dateCreated);

		        callback(null);
		    } else {
		        console.log('Oops! There was an error.' + error.code);
		        callback(error);
		    }
		});
	},

	makeCall: function(data, callback) {
		var twilio = require('twilio');

		var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
		client.makeCall({

		    to:'+17578807276', // Any number Twilio can call
		    from: '+18046812173', // A number you bought from Twilio and can use for outbound communication
		    url: 'http://stage.hourwise.com/templates/twiml.xml' // A URL that produces an XML document (TwiML) which contains instructions for the call

		}, function(err, responseData) {

		    //executed when the call has been initiated.
		    if (err) {
		    	console.log(err);
		    	callback(err);
		    }

		    //console.log(responseData.from); // outputs "+14506667788"
		    callback(null);

		});
	}
};