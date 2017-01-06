GRPC-Bus WebSocket Proxy Client

This client library connects a browser's JavaScript context to standard GRPC service(s) via a WebSocket Proxy Server


Install

```sh
npm install grpc-bus-websocket-client
```

You'll also need to install and run a [GRPC Bus WebSocket Proxy Server](http://github.com/gabrielgrant/grpc-bus-websocket-proxy-server)

Usage

```
new GBC(<grpc-bus-websocket-proxy address>, <protofile>, <service map>)
```

Example

```javascript
var GBC = require("grpc-bus-websocket-client");

new GBC("ws://localhost:8080/", 'helloworld.proto', {helloworld: {Greeter: 'localhost:50051'}})
  .connect()
  .then(function(gbc) {
    gbc.services.helloworld.Greeter.sayHello({name: 'Gabriel'}, function(err, res){
      console.log(res);
    });  // --> Hello Gabriel
  });
```



