"use strict";
var nodemailer = require('nodemailer');

/**
 * Create a reusable transport object using SMTP Transport
 */
var transporter = nodemailer.createTransport(
  {
    host: 'smtp.domain.de',
    port: 25,
    auth: {
      user: '',
      pass: ''
    }
  }
);

/**
 * Send Mail with defined transport object
 * @param mail
 * @param callback
 */
module.exports.sendMail = function (mail, callback) {
  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
      callback(error);
    } else {
      console.log('Message sent: ' + info.response);
      callback(error,info);
    }
  });
};
