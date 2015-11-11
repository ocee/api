var userService = require("./../service/license");
var koaBody = require('koa-body')();
var util = require('./../common/utils');

module.exports = function(router) {
  router.post('/api/user/login', koaBody, function*(next) {
    try {

    } catch (error) {
      throw error;
    }
  });
}
