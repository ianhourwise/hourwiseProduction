
module.exports = {
	sendDocument: function (data, callback) {
		var request = require('request');

		request.post({url: 'https://api.pandadoc.com/public/v1/documents', form: data}, function (err, httpResponse, body) {
			//PD Response
			console.log('err --- ' + err);
			console.log('http --- ' + JSON.stringify(httpResponse));
			console.log('body --- ' + body);

			callback(null);
		});
	}
};