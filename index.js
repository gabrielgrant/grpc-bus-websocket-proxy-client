//
// GRPC-Bus-Websocket-Client - Connect to standard GRPC service(s) via a WebSocket proxy.
//

"use strict";

var grpcBus = require('grpc-bus');
var protobuf = require("protobufjs");
var RSVP = require('rsvp');

// sane error handling
RSVP.on('error', function(reason, label) {
  if (label) {
    console.error(label);
  }
  console.assert(false, reason);
});

function fetchProtoFilePromise(path) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    protobuf.Util.fetch(path, function(protoFileContents) {
      if (protoFileContents === null) {
        reject(Error('Failed to fetch ' + path));
      } else {
        resolve(protoFileContents);
      }
    });
  });
  return promise;
}

var GBC = function(proxyURL, protoFile, serviceMap) {
  if (!proxyURL) {
    proxyURL = "ws://localhost:8080/";
  }
  this.protoFile = protoFile;
  this.proxyURL = proxyURL;
  this.serviceMap = serviceMap || {};
}

GBC.prototype.connect = function() {
  var self = this;
  var ws = this.ws = new WebSocket(this.proxyURL);
  ws.binaryType = "arraybuffer";  // We are talking binary
  var wsPromise = new RSVP.Promise(function(resolve, reject) {
    ws.onopen = function(){
      return resolve(ws);
    }
    ws.onerror = reject;
  });
  //var gbTree = protobuf.loadJson(require('./grpc-bus.proto.json')).build().grpcbus;
  // When loaded from the compiled JSON, the "create service" call's
  // "result" field is being loaded as `null` rather than `0`, causing
  // the response to be treated as an error.
  // Workaround: load a JS-stringified version of grpc-bus.proto insead
  var gbTree = protobuf.loadProto(require('./grpc-bus.proto.js')).build().grpcbus;
  return RSVP.hash({
    protoFileContents: fetchProtoFilePromise(this.protoFile),
    ws: wsPromise
  }).then(function(results) {
    var protoFileExt = self.protoFile.substr(self.protoFile.lastIndexOf('.') + 1);
    if (protoFileExt === "json") {
      self.protoDefs = protobuf.loadJson(results.protoFileContents, null, self.protoFile);
    } else {
      self.protoDefs = protobuf.loadProto(results.protoFileContents, null, self.protoFile);
    }
    var initMessage = {
      filename: self.protoFile,
      contents: results.protoFileContents
    };
    ws.send(JSON.stringify(initMessage));
    var gbClient = new grpcBus.Client(self.protoDefs, function(msg) {
      var pbMessage = new gbTree.GBClientMessage(msg)
      var rawMessage = pbMessage.toBuffer();
      ws.send(rawMessage);
    });

    ws.onmessage = function (event) {
      var message = gbTree.GBServerMessage.decode(event.data);
      gbClient.handleMessage(message);
    }

    var tree = self.tree = gbClient.buildTree();
    var packagePromises = {};
    var protoPackages = Object.keys(self.serviceMap);
    protoPackages.forEach(function(protoPackageName) {
      var servicesPromises = {};
      Object.keys(self.serviceMap[protoPackageName]).forEach(function(serviceName) {
        var serviceConnector = tree[protoPackageName][serviceName];
        var serviceAddress = self.serviceMap[protoPackageName][serviceName];
        servicesPromises[serviceName] = serviceConnector(serviceAddress);
      });
      packagePromises[protoPackageName] = RSVP.hash(servicesPromises)
    })
    var promiseHash = RSVP.hash(packagePromises)
    return promiseHash;
  }).then(function(results) {
    self.services = results;
    return self;
  });
}

module.exports = GBC;

// vim: tabstop=8 expandtab shiftwidth=2 softtabstop=2
