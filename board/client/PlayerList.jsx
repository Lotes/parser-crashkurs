var { Button } = require('muicss/react');
var React = require('react');
var Player = require('./Player.jsx');
var _ = require('underscore');

var PlayerList = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    connection: React.PropTypes.object.isRequired
  },

  editButtonClicked: function() {
    const players = this.props.players;
    const player = players.find(doc => doc.id == this.props.connection.playerId);
    if(player) {
      const newName = prompt("Please enter a new name!", player.name);
      if(newName)
        this.props.connection.setName(newName);
    }
  },

  render: function() {
    var { players } = this.props;
    var other = _.omit(this.props, 'players', 'selectedPlayerId');
    var playerNodes = players.map(function(player, index) {
      return (
        <Player {...other} doc={player} key={player.id} />
      );
    });
    return (
      <div>
        <div className="playerList">
          <Button className="player" color="danger" onClick={this.editButtonClicked}>Edit</Button>
          {playerNodes}
        </div>
      </div>
    );
  }
});

module.exports = PlayerList;
