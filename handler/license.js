var licenseService = require("./../service/license");
var koaBody = require('koa-body')();
var util = require('./../common/utils');

module.exports = function(router) {
  router.get('/api/license/:id', function*(next) {
    try {
      this.body = yield licenseService.getLicenseById(this.params.id);
    } catch (error) {
      throw error;
    }
  });

  router.put('/api/license/', koaBody, function*(next) {
    try {
      console.log(this.request.body);
      var key = yield util.hashKey(this.request.body.license);
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
