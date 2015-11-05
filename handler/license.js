var licenseService = require("./../service/license");

module.exports = function(router) {
  router.get('/api/license/:id', function*(next) {
    try {
      this.body = yield licenseService.getLicenseById(this.params.id);
    } catch (error) {
      throw error;
    }
  });
}
