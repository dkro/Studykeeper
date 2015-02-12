"use strict";
var nodemailer = require('nodemailer');

// Example Email
//var mail = {
//  from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
//  to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
//  subject: 'Hello ✔', // Subject line
//  text: 'Hello world ✔', // plaintext body
//  html: '<b>Hello world ✔</b>'} // html body

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(
  {
    host: 'smtp.ifi.lmu.de',
    port: 25,
    auth: {
      user: '',
      pass: ''
    }
  }
);

// send mail with defined transport object
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