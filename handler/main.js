module.exports = function(router){
  require('./license')(router);
  require('./user')(router);
};
