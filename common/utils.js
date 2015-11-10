var bcrypt = require('bcrypt');
var uuid = require('uuid');
var crypto = require('crypto');

function encrypt(key) {
  var keyMod = null;
  if (typeof key !== 'string'){
    keyMod = key.toString();
  }else{
    keyMod = key;
  }

  return function(callback) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return callback(err, null);
      }

      bcrypt.hash(keyMod, salt, function(err, hash) {
        if (err) {
          return callback(err, null);
        }

        callback(null, hash);
      });
    });
  }
}

function* loadEncrypt(key){
  return yield encrypt(key);
}

module.exports = {
  hashKey: function (license) {
    var hash = crypto.createHash('md5').update(license).digest('hex');
    return hash;
  },
  hashPassword: function *(license) {
    var hash = yield loadEncrypt(license);
    return hash;
  },
  getUuid: function(){
    return uuid.v4();
  }
}
