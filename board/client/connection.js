import sharedb from 'sharedb/lib/client';
import EventEmitter from 'events';

class Connection extends EventEmitter {
  constructor() {
    super();
    // Expose a singleton WebSocket connection to ShareDB server
    const socket = new WebSocket('ws://' + window.location.host);
    const self = this;
    function fetchId(data) {
      try{ data = JSON.parse(data.data); }catch(e) {}
      if('me' in data) {
        self.connection = new sharedb.Connection(socket);
        self.playerId = data.me;
        self.loginId = data.loginId;
        console.log('I am player '+self.playerId+' on login number '+self.loginId+'.');
        socket.removeEventListener('message', fetchId);

        const handlerPlayers = () => self.emit('playersChanged');
        self.queryPlayers = self.connection.createSubscribeQuery('players', {$sort: {name: 1}});
        self.queryPlayers.on('changed', handlerPlayers);

        const handlerLogins = () => self.emit('loginsChanged');
        self.queryLogins = self.connection.createSubscribeQuery('logins', {});
        self.queryLogins.on('changed', handlerLogins);

        var readyCount = 2;
        const handlerReady = () => {
          if(--readyCount <= 0)
            self.emit('ready');
        };
        self.queryLogins.once('ready', handlerReady);
        self.queryPlayers.once('ready', handlerReady);
      }
    }
    socket.addEventListener('message', fetchId);
    this.playerId = null;
    this.loginId = null;
    this.connection = null;
  }
  getPlayer(id) {
    return this.connection.get('players', id.toString());
  }
  getLogin(id) {
    return this.connection.get('logins', id.toString());
  }
  get players() { return this.queryPlayers.results; }
  get logins() { return this.queryLogins.results; }
  setName(name) {
    const player = this.getPlayer(this.playerId);
    const ops = [{p: ['name', 0], sd: player.data.name}, {p: ['name', 0], si: name}];
    player.submitOp(ops, function(err) {
      if (err) { console.error(err); return; }
    });
  }
  setAvatar(value) {
    const player = this.getPlayer(this.playerId);
    value = value % 10;
    player.submitOp([
      {p:['avatarId'], na: value - player.data.avatarId}
    ], function(err) {
      if (err) { console.error(err); return; }
    });
  }
  setSource(playerId) {
    const doc = this.getLogin(this.loginId);
    doc.submitOp([
      {p:['playerId'], na: playerId - doc.data.playerId},
      {p:['headLine'], na: -doc.data.headLine},
      {p:['headCh'], na: -doc.data.headCh},
      {p:['anchorLine'], na: -doc.data.anchorLine},
      {p:['anchorCh'], na: -doc.data.anchorCh}
    ], (err) => {
      if (err) { console.error(err); return; }
      this.emit('sourceChanged', playerId);
    });
  }
  setCursor(head, anchor) {
    const doc = this.getLogin(this.loginId);
    doc.submitOp([
      {p:['headLine'], na: head.line-doc.data.headLine},
      {p:['headCh'], na: head.ch-doc.data.headCh},
      {p:['anchorLine'], na: anchor.line-doc.data.anchorLine},
      {p:['anchorCh'], na: anchor.ch-doc.data.anchorCh}
    ], (err) => {
      if (err) { console.error(err); return; }
    });
  }
}

export default Connection;
