var sinon = require('sinon'),
    assert = require('assert');
   var Sails = require('sails'),
  sails;


    // describe('The User Controller', function () {
    //     describe('when we load the user index page', function () {
    //         it ('should render the view', function () {
    //             //var view = sinon.spy();
    //             UserController.find().then(function(results) {
    //       		  if (results != null)

		  //         done();
		  //       })
		  //       .catch(done);
    //             //assert.ok(view.called);
    //         });
    //     });
    // });

	before(function(done) {
    this.timeout(50000);

  Sails.lift({
         // configuration for testing purposes
  }, function(err, server) {
    sails = server;
    if (err) return done(err);

    describe.only('UsersModel', function() {

    describe('#find()', function() {
      it('should check find function', function (done) {
        User.find()
          .then(function(results) {
            // some tests
            done();
          })
          .catch(done);
      });
    });

  });

    done(err, sails);
  });
});

	

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});

describe ('Integrating nutshell credentials', function() {
    describe ('when we pass our nutshellAPI service credentials', function() {
        it ('should return nutshell data and store it on the user object', function () {

        });
    });
});