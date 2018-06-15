var http = require("http");
var ShareDB = require("sharedb");
var connect = require("connect");
var serveStatic = require('serve-static');
var ShareDBMingoMemory = require('sharedb-mingo-memory');
var WebSocketJSONStream = require('websocket-json-stream');
var WebSocket = require('ws');
var util = require('util');

// Start ShareDB
var share = ShareDB({db: new ShareDBMingoMemory()});

// Create a WebSocket server
var app = connect();
app.use(serveStatic('.'));
var server = http.createServer(app);
var wss = new WebSocket.Server({server: server});
server.listen(8080);
console.log("Listening on http://localhost:8080");

var connection = share.connect();
var playerIndex = 1;

// Connect any incoming WebSocket connection with ShareDB
wss.on('connection', function(ws, req) {
  const id = playerIndex++;
  ws.send(JSON.stringify({ me: id }));

  var stream = new WebSocketJSONStream(ws);
  share.listen(stream);

  const doc = connection.get('players', id.toString());
  doc.create({ name: 'User '+id, source: 'abc...' });

  ws.on('close', function close() {
    doc.destroy();
  });
});
