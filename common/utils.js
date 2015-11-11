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

function validateHash(password, hash){
  return function(callback){
    bcrypt.compare(password, hash, function(err, res) {
      if(err){
        return callback(err, null);
      }

      return callback(null, res);
    });
  }
}

function* loadValidateHash(password, hash){
  return yield validateHash(password, hash);
}

module.exports = {
  validatePasswordHash: function *(password, hash){
    return yield loadValidateHash(password, hash);
  },
  hashKey: function (license) {
    return crypto.createHash('md5').update(license).digest('hex');
  },
  hashPassword: function *(pw) {
    return yield loadEncrypt(pw);
  },
  getUuid: function(){
    return uuid.v4();
  }
}
