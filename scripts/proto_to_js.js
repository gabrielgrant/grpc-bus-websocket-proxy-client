var lines = [];
var lineReader = require('line-reader');

lineReader.eachLine('node_modules/grpc-bus/proto/grpc-bus.proto', function(line, last) {
    var escaped = "\"";
    escaped += line.replace(/"/g, '\\"')
    escaped += "\\n\"";
    lines.push(escaped);
  // do whatever you want with line...
  if(last){
      var fullText = "module.exports = " + lines.join("+\n") + ";";
      console.log(fullText);
    // or check if it's the last one
  }
});
