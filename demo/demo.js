//
// GRPC Bus WebSocket Proxy Client Demo
//

var GBC = require("../index.js");
var async = require("async");

var metadata = {
   "foodsILike": ["french fries", "donuts"]
};

new GBC("ws://localhost:8081/", 'helloworld.proto', {helloworld: {Greeter: 'localhost:50051'}})
  .connect()
  .then(function(gbc) {
    console.log('gbc', gbc);
    gbc.services.helloworld.Greeter.sayHello({name: 'Gabriel'}, function(err, res){
      console.log(res);
    });  // --> Hello Gabriel
    gbc.services.helloworld.Greeter.streamOutHello({name: 'Gabriel', iterations: 3}).on('data', function(data){
      console.log(data);
    });

    var call = gbc.services.helloworld.Greeter.streamInHello(null, metadata, function(error, data) {
      if (error) {
        console.log("error:", error);
      }
      console.log("data:", data);
    });
        
    function nameSender(name) {
      return function(callback) {
        call.write({
          name: name
        });
        callback();
      };
    }

    firstName = nameSender('Gabriel');
    lastName = nameSender('Grant');

    async.series([firstName, lastName], function() {
      call.end();
    });

  });

// vim: tabstop=8 expandtab shiftwidth=2 softtabstop=2
