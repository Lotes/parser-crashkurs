var http = require("http");
var ShareDB = require("sharedb");
var connect = require("connect");
var serveStatic = require('serve-static');
var ShareDBMingoMemory = require('sharedb-mingo-memory');
var WebSocketJSONStream = require('websocket-json-stream');
var WebSocket = require('ws');
var util = require('util');

const avatars = [
  'Form-AL',
  'Lotes',
  'Brent Rambo',
  'Trollface',
  'Siegbert von Schnösel',
  'Housewife',
  'PEG',
  'Lt. Parsman',
  'Kermit',
  'Dragon'
];

//address --> {playerId, count}
var addresses = {};

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
var loginIndex = 1;

// Connect any incoming WebSocket connection with ShareDB
wss.on('connection', function(ws) {
  const address = ws._socket.remoteAddress;
  const loginId = loginIndex++;

  //register new players
  if(!(address in addresses)) {
    const playerId = playerIndex++;
    console.log('* added new player '+playerId+' with address '+address)
    addresses[address] = {
      playerId: playerId,
      logins: []
    };
    const avatarId = playerId % 10;
    const doc = connection.get('players', playerId.toString());
    doc.create({
      avatarId: avatarId,
      name: avatars[avatarId],
      source: ''
    });
  }

  //inc usage of player
  addresses[address].logins.push(loginId);
  const playerId = addresses[address].playerId;
  ws.send(JSON.stringify({
    me: playerId,
    loginId: loginId
  }));

  //init source position
  const login = connection.get('logins', loginId.toString());
  login.create({
    playerId: playerId,
    charIndex: 0,
    length: 0
  });

  var stream = new WebSocketJSONStream(ws);
  share.listen(stream);

  //cleanup on disconnect
  ws.on('close', function close() {
    console.log('* logoff '+login.data.playerId);
    login.submitOp([{p:['playerId'], na: -login.data.playerId - 1}], () => {});
    addresses[address].logins = addresses[address].logins.filter(id => id != loginId);
    if(addresses[address].logins.length === 0) {
      const doc = connection.get('players', playerId.toString());

    }
  });
});
