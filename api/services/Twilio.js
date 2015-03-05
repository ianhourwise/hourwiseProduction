module.exports = {
	sendSMS: function(data) {
		var twilio = require('twilio');

		var client = new twilio.RestClient('ACd29c9b195a61c0fe4e6fc80681686749', 'c61d62a14889fa090b1b7f4d684326db');

		client.sms.messages.create({
		    to:'+1' + data.toNumber,
		    from:'+15005550006', //change later? Not sure just found it in the account
		    body: data.smsContent
		}, function(error, message) {
		    if (!error) {
		        console.log('Success! The SID for this SMS message is:');
		        console.log(message.sid);
		 
		        console.log('Message sent on:');
		        console.log(message.dateCreated);
		    } else {
		        console.log('Oops! There was an error.' + error.code);
		    }
		});
	}
};