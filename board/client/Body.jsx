var React = require('react');
var PlayerList = require('./PlayerList.jsx');
var Connection = require('./Connection');

var Body = React.createClass({
  getInitialState: function() {
    return {
      connection: new Connection(() => {
        const comp = this;
        this.query = this.state.connection.connection.createSubscribeQuery('players', {$sort: {name: 1}});
        this.query.on('ready', update);
        this.query.on('changed', update);

        function update() {
          comp.setState({players: comp.query.results});
        }
      }),
      players: []
    };
  },

  componentDidMount: function() {

  },

  componentWillUnmount: function() {
    this.query.destroy();
  },

  render: function() {
    return (
      <div className="app">
        <div className="header">
          <div className="userListPane">
            <PlayerList {...this.state}/>
          </div>
        </div>
        <div className="content">
          <div className="editorPane">

          </div>
          <div className="validationPane">

          </div>
        </div>
        <div className="footer">
            Made by Markus Rudolph
        </div>
    </div>
    );
  }
});

module.exports = Body;
