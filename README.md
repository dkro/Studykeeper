Studykeeper
================


Steps to take for preparing the server for usage:

1. Edit backend/config/mysql.js

Edit the following values to match your mysql database.

  host: '127.0.0.1',
  user: 'root',
  password: '',
  port: 3306,
  database: 'studykeeper'

2. Edit backend/config/routes.js

On some Systems the path in 'directory' can not be resolved the way its implemented

  app.get(/^\/(?!api).*/, restify.serveStatic({
    'directory': '../frontend/public/',
    'default' : 'index.html'
  }));

Edit the directory value to the full path to the /frontend/public directory in your system.
If your system can not detect the path you will notice it due to the webserver beeing unable to serve the HTML,CSS,JS
when calling the /index URL. It will instead show JSON Failure messages.

3. Edit /backend/utilities/mail.js

Edit the following values to match your mail server
   {
    host: 'smtp.ifi.lmu.de',
    port: 25,
    auth: {
      user: 'example',
      pass: 'pass'
    }

4. The System sends multiple Emails with hardcoded Links.
 You need to adjust the links to match the URL's used in the live environment.

 To do this you need to adjust one Variable in /backend/controller/users:
 On Top of the file you need to adjust

 var URL = "http://studykeeper.medien.ifi.lmu.de:10001"

 So that the String represents the URL of the environment.





