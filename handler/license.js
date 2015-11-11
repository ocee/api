var licenseService = require("./../service/license");
var koaBody = require('koa-body')();
var util = require('./../common/utils');

module.exports = function(router) {
  router.get('/api/license/:license', function*(next) {
    try {
      var key = util.hashKey(this.params.license);
      this.body = yield licenseService.getLicenseByHash(key);
    } catch (error) {
      throw error;
    }
  });

  router.put('/api/license/', koaBody, function*(next) {
    try {
      var key = util.hashKey(this.request.body.license);
      var uuid = util.getUuid();
      var rating = this.request.body.rating;
      var result = yield licenseService.upsertLicense(key, uuid, rating);
      this.body = result;
      this.response.status = 204;
    } catch (error) {
      throw error;
    }
  });
}
