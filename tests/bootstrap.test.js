var Sails = require('sails'),
  sails;

before(function(done) {
  Sails.lift({
    // configuration for testing purposes
  }, function(err, server) {
    sails = server;
    if (err) return done(err);

    console.log('---------SAILS IS UP---------');
    
    var UserController = require('../../api/controllers/UserController'),
    sinon = require('sinon'),
    assert = require('assert');

    describe('The User Controller', function () {
        describe('when we load the user index page', function () {
            it ('should render the view', function () {
                var view = sinon.spy();
                UserController.new(null, {
                    view: view
                });
                assert.ok(view.called);
            });
        });
    });

    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});