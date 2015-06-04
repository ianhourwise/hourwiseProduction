var User = require('../../api/models/User.js')

describe.only('UserModel', function() {

  describe('#find()', function() {
    it('should check find function', function (done) {
      User.clearAllAlerts(function(results) {
          console.log('---------');  

          done();
        })
        .catch(done);
    });
  });

});