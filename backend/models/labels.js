"use strict";
var connection      = require('../config/mysql').connection;

module.exports.addLabel = function (label, callback) {
  connection.query('INSERT INTO labels (title) VALUES (?)',
    label.title,
    callback);
};

module.exports.deleteLabel = function (label, callback) {
  connection.query('DELETE FROM labels ' +
                    'WHERE id=?',
    [label.id,label.title],
    callback);
};

module.exports.getAllLabels = function (callback) {
  connection.query('SELECT * FROM labels',callback);
};

module.exports.getLabelById = function (id, callback) {
  connection.query('SELECT * FROM labels WHERE id=?',
    id, callback);
};

module.exports.mapLabeltoUserstudy = function (label, userstudy, callback) {
  connection.query('INSERT INTO studies_labels_rel ' +
    '(studyId,labelId) ' +
    'VALUES (' +
    '(SELECT id FROM userstudies WHERE id=? AND title=?),' +
    '(SELECT id FROM labels WHERE id=? AND title=?));',
    [userstudy.id,userstudy.title,label.id,label.title],
    callback);
};
