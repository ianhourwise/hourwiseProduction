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
    Company.findOne({id: req.param('id')}).populate('employees').populate('owner').exec( function (err, company) {
      if (err)
        throw(err);

      User.find({role: 'concierge'}, function (err, users) {
        if (err)
          throw(err);

        res.view('callcenter/keenerTemplate', {
          company: company,
          users: users,

        });
      });

    }); 
  },

  referral: function (req, res) {
    User.findOne({email: req.param('email')}).populate('company').exec( function (err, user) {
      if (err)
        throw (err);

      res.locals.layout = 'layouts/referralLayout';

      res.view('referral/referral', {
        user: user
      });
    });
  },

  keenerTask: function (req, res) {
    var urgency = 'Not Urgent';

    if (req.param('urgent') == 'urgent')
      urgency = 'Urgent';

    var taskName = req.param('messageType') + ' from ' + req.param('name') + ' - ' + urgency;

    var taskOwner = 'Unspecified';

    if (req.param('companyRep') != 'null')
        taskOwner = req.param('companyRep');

    var taskDescription = 'From: ' + req.param('name') + '\n To: ' + taskOwner + '\n Address: ' + req.param('address') + '\n Phone Number: ' + req.param('phoneNumber') + '\n Email: ' + req.param('email') + '\n \n \n Message: ' + req.param('message');

    var taskCategory = req.param('messageType');

    var fromEmail = 'ccs_' + req.param('id') + '@hourwise.com';

    if (req.param('id') == '5506ccae677a3603007ce0d8')
      Mandrill.sendEmail({'toEmail': 'millie@89paint.com', 'toName': 'Millie', 'fromEmail': fromEmail, 'subject': taskName, 'body': taskDescription}, function (err) {});
    else
       Mandrill.sendEmail({'toEmail': 'support@hourwise.com', 'toName': 'Hourwise Support', 'fromEmail': fromEmail, 'subject': taskName, 'body': taskDescription}, function (err) {});
    
    res.send(200);

    // var taskOwner = null;

    // if (req.param('companyRep') != 'null')
    //   taskOwner = req.param('companyRep');

    // else if (req.param('hourwiseRep') != 'null')
    //   taskOwner = req.param('hourwiseRep');

    // Task.create({'name': taskName, 'description': taskDescription, 'status': 'open', 'category': taskCategory, 'owner': taskOwner}, function (err, task) {
    //     if (err)
    //       console.log(err);

    //     if (taskOwner != 'null') {
    //       User.findOne({id: taskOwner}, function (err, user) {
    //           if (err)
    //             console.log(err);

    //           var uuid = require('node-uuid');

    //           var alertId = uuid.v4();

    //           user.addAlert(taskName, alertId, task.id, true);
    //           User.publishUpdate(taskOwner, { message: taskName, id: alertId, communicationId: task.id, fromTask: true  });

    //           Mandrill.sendEmail({'toEmail': 'support@hourwise.com', 'toName': 'Hourwise Support', 'fromEmail': req.param('email'), 'subject': taskName, 'body': taskDescription}, function (err) {

    //           });

    //           res.send(200);

    //       });
    //     }
    //     else 
    //       res.send(200);
    // }); 
  },

  signUp: function (req, res) {
    console.log(req.params.all());
    res.locals.layout = false;
    res.view('signUpWizard', {
      showLeadGen: req.param('showLeadGen'),
      showPipeline: req.param('showPipeline'),
      showDocument: req.param('showDocument'),
      email: req.param('email'),
      name: req.param('name')
    });
  },

  firstStep: function (req, res) {
    User.findOne({email: req.param('referrer')}).exec( function (err, user) {
      if (err)
        throw (err);

      if (user == null)
        user = {email: 'none'};

      res.locals.layout = false;

      res.view('firstStep', {
        user: user
      });
    });
   },

  firstStepData: function (req, res) {
    console.log(req.params.all());

  },

  finishedWizard: function (req, res) {
    console.log(req.params.all());

    res.redirect('thanks');
  }
};

