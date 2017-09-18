//
// GRPC Bus WebSocket Proxy Client Demo
//

var GBC = require("../index.js");
var async = require("async");

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

    var call = gbc.services.helloworld.Greeter.streamInHello(function(error, data) {
      if (error) {
        console.log("error:", error);
      }
      console.log("data:", data);
    });
        
    function nameSender(name) {
      return function(callback) {
        console.log("sending name:", name);
        call.write({
          name: name
        });
        callback();
      };
    }

    firstName = nameSender('Gabriel');
    lastName = nameSender('Grant');

    async.series([firstName, lastName], function() {
      console.log("Finished sending names ... closing call");
      call.end();
    });

  });

// vim: tabstop=8 expandtab shiftwidth=2 softtabstop=2
