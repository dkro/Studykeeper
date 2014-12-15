var usercontoller = require('../controllers/users.js');
var request = require('request');



describe("getUsers", function(){

  it("should show return a list of all users.", function(){
    var userlist = usercontoller.getUsers(request, res);
    expect(userlist).toBe(6);
  });

  //it("should respond with hello world", function(done) {
  //  request("http://localhost:8080/api/user/all", function(error, response, body){
  //    expect(body).toEqual("hello world");
  //    done();
  //  });
  //});

});