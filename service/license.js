module.exports = function(router){
  router.get('/api/license/:id', function *(){
    console.log('test');
    this.body = 'response here';
  });
}
