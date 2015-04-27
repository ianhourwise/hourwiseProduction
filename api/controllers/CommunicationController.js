/**
 * CommunicationController
 *
 * @description :: Server-side logic for managing communications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	index: function(req, res) {
		Communication.findOne(req.param('id')).populate('touches').exec(function (err, communication) {
			if (err)
				console.log(err);

			User.findOne({primaryNumber: communication.primaryNumber}).exec(function (err, user) {
				if (err)
					console.log(err);

				res.locals.layout = 'layouts/communicationIndex';

				res.view({
					communication: communication,
					user: user
				});
			});
		});
	}
	
};

