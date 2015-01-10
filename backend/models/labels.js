"use strict";
var connection      = require('../config/mysql').connection;

module.exports.addLabel = function (label, callback) {
  connection.query('INSERT INTO labels (title) VALUES (?)',
    label.title,
    callback);
};

module.exports.getAllLabels = function (callback) {
  connection.query('SELECT * FROM labels',callback);
};

module.exports.getLabel = function (label, callback) {
  connection.query('SELECT * FROM labels WHERE title=?',
    label.title,
    callback);
};

module.exports.mapLabeltoUserstudy = function (label, userstudy, callback) {
  connection.query('INSERT INTO studies_labels_rel ' +
    '(studyId,labelId) ' +
    'VALUES (' +
    '(SELECT id FROM userstudies WHERE id=? AND title=?),' +
    '(SELECT id FROM labels WHERE title=?));',
    [userstudy.id,userstudy.title,label.title],
    callback);
};
