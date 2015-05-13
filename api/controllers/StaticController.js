/**
 * StaticController
 *
 * @description :: Server-side logic for managing statics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `StaticController.homepage()`
   */
  homepage: function (req, res) {
    return res.view();
  },


  /**
   * `StaticController.keener()`
   */
  keener: function (req, res) {
    res.locals.layout = false;
    Company.findOne({id: req.param('id')}).populate('employees').exec( function (err, company) {
      if (err)
        throw(err);

      User.find({role: 'concierge'}, function (err, users) {
        if (err)
          throw(err);

        res.view('callcenter/keenerTemplate', {
          company: company,
          users: users
        });
      });

    }); 
  },

  keenerTask: function (req, res) {
    var taskName = req.param('messageType') + ' from ' + req.param('name');

    var taskDescription = 'Name: ' + req.param('name') + '\n Address: ' + req.param('address') + '\n Phone Number: ' + req.param('phoneNumber') + '\n Email: ' + req.param('email') + '\n \n \n Message: ' + req.param('message');

    var taskCategory = req.param('messageType');

    var taskOwner = null;

    if (req.param('companyRep') != null)
      taskOwner = req.param('companyRep');

    else if (req.param('hourwiseRep') != null)
      taskOwner = req.param('hourwiseRep');

    Task.create({'name': taskName, 'description': taskDescription, 'status': 'open', 'category': taskCategory, 'owner': taskOwner}, function (err, task) {
        if (err)
          console.log(err);

        if (taskOwner != null) {
          User.findOne({id: taskOwner}, function (err, user) {
              var uuid = require('node-uuid');

              var alertId = uuid.v4();
              user.addAlert(taskName, alertId, task.id, true);
              User.publishUpdate(taskOwner, { message: taskName, id: alertId, communicationId: task.id, fromTask: true  });

              Mandrill.sendEmail({'toEmail': 'support@hourwise.com', 'toName': 'Hourwise Support', 'fromEmail': req.param('email'), 'subject': taskName, 'body': taskDescription}, function (err) {
                res.send(200);
              });
          });
        }
        else 
          res.send(200);
    }); 
  }
};

