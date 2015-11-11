var db = require('./database');

module.exports = {
  getUserByEmail: function*(email) {
    if (!email) {
      console.log('throw email error');
      throw new Error('email is null');
    }

    try {
      var result = null,
      sqlStatement = `SELECT ocee_user_id, email, password, profile FROM ocee_user WHERE email = $1`;
      result = yield db.executeScript(sqlStatement, [email]);
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
  createUser: function*(user_id,email, pwHash, profile) {
    if (!email) {
      console.log('throw email error');
      throw new Error('email is null');
    }

    try {
      var result = null,
      sqlStatement = `INSERT INTO ocee_user (ocee_user_id, email, password, profile) VALUES ($1, $2, $3, $4);`;
      result = yield db.executeScript(sqlStatement, [user_id, email, pwHash, profile]);
      return;
    } catch (error) {
      throw error;
    }
  }
}
