var UserController = require('../../api/controllers/UserController'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The User Controller', function () {
    describe('when we load the user index page', function () {
        it ('should render the view', function () {
            var view = sinon.spy();
            UserController.index(null, {
                view: view
            });
            assert.ok(view.called);
        });
    });
});


describe('User tries to login', function () {
    describe('when we load the user new page', function () {
        it ('should render the view', function () {
            var view = sinon.spy();
            UserController.new(null, {
                view: view
            });
            assert.ok(view.called);
        });
    });
});