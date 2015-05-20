var request = require('supertest');

describe('AuthController', function() {

  describe('#login()', function() {
    it('should redirect with 302', function (done) {
    	console.log('-------------------');
      request(sails.hooks.http.app)
        .post('/auth/local')
        .send({ name: 'ian@hourwise.com', password: '49616E' })
        .expect(302, done)
        // .expect('location','/mypage', done);
    });
  });

});