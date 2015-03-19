var UserController = require('../../api/controllers/UserController'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The User Controller', function () {
    describe('when we load the user index page', function () {
        it ('should render the view', function () {
            var view = sinon.spy();
            req.session.User.role = "user";
            UserController.new(null, {
                view: view
            });
            assert.ok(view.called);
        });
    });
});