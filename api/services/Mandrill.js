module.exports = {
	sendEmail: function(data) {
		var mandrill = require('node-mandrill')('mLUovq8DRL15J1jJFDJKWA');

		mandrill('/messages/send', {
			message: {
			    to: [{email: data.toEmail, name: data.toName}],
			    from_email: data.fromEmail,
			    subject: data.subject,
			    text: data.body
			}
			}, function(error, response)
			{
			//uh oh, there was an error
			if (error) console.log( JSON.stringify(error) );

			//everything's good, lets see what mandrill said
			else console.log(response);
			});
	}
};