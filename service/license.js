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

  var connect = yield execute(script, params, db);
  return connect;
}

module.exports = {
  getLicenseByHash: function*(licenseHash) {
    if (!licenseHash) {
      console.log('throw license id error');
      throw new Error('license id is null');
    }

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
        license_hash = $1`;
      result = yield executeScript(sqlStatement, [licenseHash], db);
      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error('no results found');
      }
    } catch (error) {
      throw error;
    }
  },
  upsertLicense: function*(licenseHash, licenseId, rating) {
    if (!licenseId) {
      console.log('throw license id error');
      throw new Error('license id is null');
    }

    try {
      var db = yield loadDB(),
        result = null,
        sqlStatement = `SELECT upsert($1,$2,$3);`;
      result = yield executeScript(sqlStatement, [licenseHash, licenseId, rating], db);
      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error('no results found');
      }
    } catch (error) {
      throw error;
    }
  }
}
