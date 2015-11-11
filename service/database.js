var config = require('config'),
  pg = require('pg'),
  pgConfig = config.get('postgres');

function connectDb() {
  return function(callback) {
    pg.connect(pgConfig.connection_string, function(err, client, done) {
      if (err) {
        return callback(err, null);
      }

      return callback(null, {
        client: client,
        done: done
      });
    });
  }
}

function* loadDB() {
  var connect = yield connectDb();
  return connect;
}

function execute(script, params, db) {
  if (!db || !db.client || !db.done) {
    throw new Error('db connection object is missing objects');
  }

  return function(callback) {
    db.client.query(script, params, function(err, result) {
      db.done();

      if (err) {
        return callback(err, null);
      }

      return callback(null, result.rows);
    });
  }
}

function* executeScript(script, params, db) {
  if (!script) {
    throw new Error('script is null');
  }
  if (!db || !db.client || !db.done) {
    throw new Error('db connection object is missing objects');
  }

  var result = yield execute(script, params, db);
  return result;
}

module.exports = {
  executeScript: function *(script, params) {
    var db = null,
    result = null;

    if (!script) {
      throw new Error('script is null');
    }

    db = yield loadDB();
    result = yield execute(script, params, db);
    return result;
  }
}
