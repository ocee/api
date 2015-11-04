var config = require('config');
var serverConfig = config.get('server');
var app = require('koa')();
var router = require('koa-router');
var api = router();

//initialize handlers
require('./handler/main')(api);

app.use(api.routes())
app.use(api.allowedMethods());

app.listen(serverConfig.port);
