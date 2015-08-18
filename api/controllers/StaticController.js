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

    // if (req.param('id') == '5506ccae677a3603007ce0d8')
    //   Mandrill.sendEmail({'toEmail': 'millie@89paint.com', 'toName': 'Millie', 'fromEmail': fromEmail, 'subject': taskName, 'body': taskDescription}, function (err) {});
    // else
    Mandrill.sendEmail({'toEmail': 'support@hourwise.com', 'toName': 'Hourwise Support', 'fromEmail': fromEmail, 'subject': taskName, 'body': taskDescription}, function (err) {});
    
    res.send(200);
  },

  signUp: function (req, res) {
    console.log(req.params.all());
    res.locals.layout = false;
    res.view('signUpWizard', {
      showLeadGen: req.param('showLeadGen'),
      showPipeline: req.param('showPipeline'),
      showDocument: req.param('showDocument'),
      email: req.param('email'),
      name: req.param('name'),
      referrer: req.param('referrer')
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

  createAccount: function (req, res) {  
    User.findOne({email: req.param('referrer')}, function (err, referrer) {
      if (err)
        console.log(err);

      if (referrer != null) {
        User.create({email: req.param('email'), referrer: referrer.id, role: 'bounced'}, function (err, user) {
          if (err)
            console.log(err);

          Passport.create({
                protocol : 'local'
              , password : 'foobar'
              , user     : user.id
              }, function (err, passport) {
                if (err) {
            
                  return user.destroy(function (destroyErr) {
                    next(destroyErr || err);
                  });
                }

                console.log('success');
          });
        });
      }
      else {
        User.create({email: req.param('email'), referrer: null, role: 'bounced'}, function (err, user) {
          if (err)
            console.log(err);

          Passport.create({
                protocol : 'local'
              , password : 'foobar'
              , user     : user.id
              }, function (err, passport) {
                if (err) {
            
                  return user.destroy(function (destroyErr) {
                    next(destroyErr || err);
                  });
                }

                console.log('success');
          });
        });
      }
    });
  },

  finishedWizard: function (req, res) {
    console.log(req.params.all());

    User.update({email: req.param('email')}, {name: req.param('name'), role: 'lead', interestedInLeadGen: req.param('interestedInLeadGen'), interestedInPipeline: req.param('interestedInPipeline'), interestedInDocument: req.param('interestedInDocument'), wizardInfo: req.param('wizardInfo')}, function (err, users){
      //send email to support
      //create nutshell lead and note
      if (err)
        console.log(err);

      var formatString = 'Name: ' + req.param('name') + '\nEmail: ' + req.param('email') + '\nReferrer: ' + req.param('referrer') + '\nInterested in Lead Gen?: ' + req.param('interestedInLeadGen') + '\nInterested in Pipeline?: ' + req.param('interestedInPipeline') + '\nInterested in Document?: ' + req.param('interestedInDocument');
      formatString += '\n\nQuestionaire:\n';

      var wizardInfo = req.param('wizardInfo');

      if (wizardInfo.currentLeadGen)
        formatString += 'Do they currently use lead gen services?: ' + wizardInfo.currentLeadGen;

      if (wizardInfo.pipelineTracking)
        formatString += '\nHow do they track their pipeline now?: ' + wizardInfo.pipelineTracking;

      if (wizardInfo.pipelineLeadSources)
        formatString += '\nHow do they currently get leads?: ' + wizardInfo.pipelineLeadSources;

      if (wizardInfo.documentGen)
        formatString += '\nHow do they currently create their documents?: ' + wizardInfo.documentGen;

      if (wizardInfo.documentSending)
        formatString += '\nHow do they currently send their documents?: ' + wizardInfo.documentSending;

      if (wizardInfo.documentPaperwork)
        formatString += '\nWhat sort of startard paperwork do they have in their proposals?: ' + wizardInfo.documentPaperwork;

      Mandrill.sendEmail({'toEmail': 'support@hourwise.com', 'toName': 'Hourwise Support', 'fromEmail': 'support@hourwise.com', 'subject': 'New Lead', 'body': formatString}, function (err) {});
      NutshellApi.newLead(formatString);

      res.view('thanks');
    });

    
  }
};

