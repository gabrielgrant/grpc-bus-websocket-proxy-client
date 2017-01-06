//
// GRPC Bus WebSocket Proxy Client Demo
//

var GBC = require("../index.js");

new GBC("ws://localhost:8081/", 'helloworld.proto', {helloworld: {Greeter: 'localhost:50051'}})
  .connect()
  .then(function(gbc) {
    console.log('gbc', gbc);
    gbc.services.helloworld.Greeter.sayHello({name: 'Gabriel'}, function(err, res){
      console.log(res);
    });  // --> Hello Gabriel
  });

// vim: tabstop=8 expandtab shiftwidth=2 softtabstop=2
