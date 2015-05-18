
module.exports = {
	sendDocument: function (token, data, callback) {
		console.log('token --- ' + token);

		var request = require('request');

		request({
			url: 'https://api.pandadoc.com/public/v1/documents',
			method: "POST",
			form: data,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Authorization': 'Bearer ' + token
			}
		}, function (err, httpResponse, body) {
			//PD Response

			console.log('err --- ' + err);
			console.log('http --- ' + JSON.stringify(httpResponse));
			console.log('body --- ' + body);

			// var info = JSON.parse(body);

			// var id = info.uuid;

			// var gui = require('nw.gui');

			// gui.Shell.openExternal('https://app.pandadoc.com/a/#/documents/' + uuid + '/timeline');

			callback(null);
		});

		// request.post({url: 'https://api.pandadoc.com/public/v1/documents', form: data}, function (err, httpResponse, body) {
		// 	//PD Response
		// 	console.log('err --- ' + err);
		// 	console.log('http --- ' + JSON.stringify(httpResponse));
		// 	console.log('body --- ' + body);

		// 	callback(null);
		// });
	}
};