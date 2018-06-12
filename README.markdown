GRPC-Bus WebSocket Proxy Client

This client library connects a browser's JavaScript context to standard GRPC service(s) via a WebSocket Proxy Server with full support for bi-directional streaming (ie both [server-initiated](https://github.com/gabrielgrant/grpc-bus-websocket-proxy-client/blob/master/demo/demo.js#L23) or [client-initiated](https://github.com/gabrielgrant/grpc-bus-websocket-proxy-client/blob/master/demo/demo.js#L23))


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

For more complex proto defs that import other `.proto` files, the proto
def tree should be compiled into a single JSON file using the `pbjs`
command line utility included with the `protobufjs` lib from NPM.

After installing `grpc-bus-websocket-client`, run the
compilation from your project directory:

```
./node_modules/protobufjs/bin/pbjs helloworld.proto > helloworld.proto.json
```
