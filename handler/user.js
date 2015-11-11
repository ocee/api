var userService = require("./../service/user");
var koaBody = require('koa-body')();
var util = require('./../common/utils');

module.exports = function(router) {
  router.post('/api/user/login', koaBody, function*(next) {
    try {
      var pw = this.request.body.password,
      email = this.request.body.email;
      var user = yield userService.getUserByEmail(email);
      var isValid = yield util.validatePasswordHash(pw, user.password);
      this.body = isValid;
    } catch (error) {
      throw error;
    }
  });
  router.post('/api/user/register', koaBody, function*(next) {
    try {
      var pw = this.request.body.password,
      email = this.request.body.email,
      user = yield userService.getUserByEmail(email),
      uuid = util.getUuid(),
      result = null,
      pwHash = null;
      if(user){
        this.body = "user already exists.";
        return this.response.status = 409;
      }

      pwHash = yield util.hashPassword(pw);
      console.log(pwHash);
      result = yield userService.createUser(uuid,email,pwHash, null);
      this.response.status = 204;
    } catch (error) {
      throw error;
    }
  });
}
