module.exports = {
	sendSMS: function(data, callback) {
		var twilio = require('twilio');

		var client = new twilio.RestClient('AC1a4872ecbf44901850cd912d7ad4095b', 'b2f8d9837c132f73281ce615ca933952');

		client.sms.messages.create({
		    to:'+1' + data.toNumber,
		    from:'+18046812173', //change later? Not sure just found it in the account
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
	}
};