var JobController = require('../../api/controllers/JobController'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The Job Controller', function () {
    describe('when we load the page for jobs index', function () {
        it ('should render the view', function () {
            var view = sinon.spy();
            JobController.index(null, {
                view: view
            });
            assert.ok(view.called);
        });
    });
});