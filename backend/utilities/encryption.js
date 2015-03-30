var bcrypt = require('bcrypt-nodejs');

/**
 * Encrypts the passwort with the bcrypt Algorithm
 * @param password Password to be encrypted
 * @param callback Callback with the encrypted password
 */
exports.cryptPassword = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {

    if (err) {
      return callback(err);
    }

    bcrypt.hash(password, salt, function() {}, function(err, hash) {
      return callback(err, hash);
    });

  });
};

/**
 * Compares the password with an encrypted version
 * @param password The encrypted password
 * @param userPassword The password to be compared to
 * @param callback A Callback with a boolean representing the state of the comparison
 */
exports.comparePassword = function(password, userPassword, callback) {
  bcrypt.compare(userPassword, password, function(err, isPasswordMatch) {

    if (err) {
      return callback(err);
    }

    return callback(null, isPasswordMatch);
  });
};