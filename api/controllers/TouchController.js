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

 				// User.findOne('email': req.param('fromEmail'))

 				// var touchData = {
 				// 	type: 'email',
 				// 	owner: 
 				// };
 			}
 		});
 	},
	
};

