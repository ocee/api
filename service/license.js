var db = require('./database');

module.exports = {
  getLicenseByHash: function*(licenseHash) {
    if (!licenseHash) {
      console.log('throw license id error');
      throw new Error('license id is null');
    }

    try {
      var result = null,
        sqlStatement =
        `SELECT
        license_id,
        license_hash,
        rating
      FROM
        license
      WHERE
        license_hash = $1`;
      result = yield db.executeScript(sqlStatement, [licenseHash]);
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
      var result = null,
        sqlStatement = `SELECT upsert($1,$2,$3);`;
      result = yield db.executeScript(sqlStatement, [licenseHash, licenseId, rating], db);
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
