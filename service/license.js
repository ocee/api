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
  var connect = yield execute(script, params, db);
  return connect;
}

module.exports = {
  getLicenseById: function*(licenseId) {
    try {
      var db = yield loadDB(),
      result = null,
      sqlStatement =
      `SELECT
        license_id,
        license_hash,
        rating
      FROM
        license
      WHERE
        license_id = $1`;
      result = yield executeScript(sqlStatement, [licenseId], db);
      if(result.length > 0){
        return result[0];
      }
      else {
          throw new Error('no results found');
      }
    } catch (error) {
      throw error;
    }
  }
}
