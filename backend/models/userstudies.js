var connection      = require('../config/mysql').connection;

module.exports.addUserStudy = function (data, callback) {
  var queryData = {
    title: data.title,
    tutorname: data.tutorname,
    executorname : data.executorname,
    from: data.fromDate,
    until: data.untilDate,
    description: data.description,
    link: data.doodleLink,
    paper: data.paper,
    mmi: data.mmi,
    compensation: data.compensation,
    location: data.location
  };
  connection.query('INSERT INTO userstudies ' +
  '(tutorId,executorId,fromDate,untilDate,title,description,' +
    'link,paper,mmi,compensation,location,visible,published) ' +
  'VALUES (' +
    '(SELECT id FROM users WHERE username=?),' +
    '(SELECT id FROM users WHERE username=?),' +
    '?,?,?,?,?,?,?,?,?,1,0);',
    [queryData.tutorname,
      queryData.executorname,
      queryData.from,queryData.until,queryData.title,queryData.description,
      queryData.link,queryData.paper,queryData.mmi,queryData.compensation,
      queryData.location],
    callback);
};

module.exports.deleteUserStudy = function (data, callback) {
  // TODO set visible false
};

module.exports.editUserStudy = function (data, callback) {
  // TODO
};

module.exports.startUserStudy = function(title, callback){
  // TODO set published true
};

module.exports.getUserstudyById = function (id, callback) {
  connection.query('SELECT * FROM userstudies WHERE id=?',id, callback);
};

module.exports.getAllUserstudies = function (callback) {
  connection.query('SELECT * FROM userstudies', callback);
};