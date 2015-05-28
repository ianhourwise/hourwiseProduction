/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  sails.services.passport.loadStrategies();
  var newrelic = require('newrelic');
  //Jobs.schedule('everyday at 6:30am', 'Nutshell', {});

 //  	var drone = require('schedule-drone');

	// drone.setConfig({
	//     persistence:{
	//         type: 'mongodb',
	//         connectionString: 'mongodb://localhost:27017/scheduled-events'}});

	// drone.setConfig({
	// 	    persistence:{
	// 	        type: 'mongodb',
	// 	        connectionString: 'mongodb://admin:$tageHourW!$e@dogen.mongohq.com:10045/hourwise-staging/scheduled-events'}});
	 
	//scheduler = drone.daemon();

	// scheduler.on('taskDueTrigger', function(task) {
	// 	console.log('hitting that trigger ' + task);

	// 	User.findOne({id: task.owner}, function (err, user) {
	// 		var uuid = require('node-uuid');

	// 		var alertId = uuid.v4();

	// 		user.addAlert('Task ' + task.name + ' is due today!', alertId, task.id, true);
	// 		User.publishUpdate(task.owner, { message: 'Task ' + task.name + ' is due today!', id: alertId, communicationId: task.id, fromTask: true  });
	// 	});
	// });
  cb();
};
