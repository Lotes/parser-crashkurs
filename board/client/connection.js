const sharedb = require('sharedb/lib/client');
function Connection(readyCallback) {
  // Expose a singleton WebSocket connection to ShareDB server
  const socket = new WebSocket('ws://' + window.location.host);
  const self = this;
  function fetchId(data) {
    try{ data = JSON.parse(data.data); }catch(e) {}
    if('me' in data) {
      self.connection = new sharedb.Connection(socket);
      self.playerId = data.me;
      socket.removeEventListener('message', fetchId);
      readyCallback();
    }
  }
  socket.addEventListener('message', fetchId);
  this.playerId = null;
  this.connection = null;
}

Connection.prototype = {
  setName: function(name) {
    const player = this.connection.get('players', this.playerId.toString());
    console.log("first", player.data.name);
    const op1 = [{p: ['name', 0], sd: player.data.name}];
    const op2 = [{p: ['name', 0], si: name}];
    console.log("first")
    player.submitOp(op1, function(err) {
      if (err) { console.error(err); return; }
    });
    console.log("second")
    player.submitOp(op2, function(err) {
      if (err) { console.error(err); return; }
    });
  }
};

module.exports = Connection;
