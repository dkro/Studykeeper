Studykeeper
================

Studykeeper (Initially called UserstudyManager) is a web application that allows users to create, manage and register to user studies.

Due to the necessity of realizing a large amount of user studies for research at the Media Informatics and HCI department of the University of Munich, there's a lot of overhead for the planning, recruiting of participants and evaluation of these studies. Therefore Studykeeper helps the performer of a study to create, plan and realize multiple user studies. And on the other hand, potential participants are able to access an overview of all existing and published studies, with the possibility to register for them.

The application was developed in the context of the bachelor thesis "A Management Tool for Scientific Evaluations and User Study Planning" at the Media Informatics department at the Ludwig-Maximilian University of Munich. 


Authors
================

Amadeus Schell / amadeus.schell17@gmail.com

David Kronmüller / david.kronmueller@gmail.com


Front end
================

For the front end, the framework [Ember.js](https://www.emberjs.com) was used.

As time was short to create a fully customized design, the [Bootstrap](https://getbootstrap.com/) framework was used to provide a quick solution for a mobile first and responsive user interface.


Back end
================

For the server side, the JavaScript runtime [Node.js](https://nodejs.org) and the database management system [MySQL](https://www.mysql.com/) were used as backbone.



Steps to take for preparing the server for usage
===============



**1) Edit backend/config/mysql.js** 

Edit the following values to match your mysql database:

```
host: '127.0.0.1',
user: 'root',
password: '',
port: 3306,
database: 'studykeeper'
```
  
Setup the database:

*/backend/init.sql* can be used to initialize the database the first time. It has no other content than the predefined roles.
To create the first admin user, simply register a new user in the system by using the UI and then change the user's role value in the table *users* directly in the database to match the id for the role *tutor* from the table *roles*. 
This admin user can then directly create new *tutor* users (i.e. administrators in the system) by using the user interface.

---

**2) Edit backend/config/routes.js**

On some systems the path in *directory* can not be resolved in the way it is implemented:

```javascript
app.get(/^\/(?!api).*/, restify.serveStatic({
    'directory': '../frontend/public/',
    'default' : 'index.html'
}));
```

Edit the directory value to the full path of the directory */frontend/public* in your system.
If your system can not detect the path, you will notice this due to the web server being unable to serve the HTML, CSS and JavaScript files
when calling the */index* URL. In this case, JSON Failure messages will be shown.

---

**3) Edit /backend/utilities/mail.js**

Edit the following values to match your mail server:

```
{
    host: 'smtp.ifi.lmu.de',
    port: 25,
    auth: {
        user: 'example',
        pass: 'pass'
    }
}
```
   
---

**4. Adjust the hard coded links that the system sends via multiple e-mails to match the URL's used in the live environment**

To do this, you need to adjust one particular variable in */backend/controller/users*. At the beginning of the file, the following needs to be modified so that the String represents the URL of the environment.

```
var URL = "http://studykeeper.medien.ifi.lmu.de:10001"
```





