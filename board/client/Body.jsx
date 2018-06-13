var React = require('react');
var PlayerList = require('./PlayerList.jsx');


var Body = React.createClass({
  render: function() {
    return (
      <div className="app">
        <div className="header">
          <div className="userListPane">
            <PlayerList players={[]}/>
          </div>
        </div>
        <div className="content">
          <div className="editorPane">

          </div>
          <div className="validationPane">

          </div>
        </div>
        <div className="footer">
            Mady by Markus Rudolph
        </div>
    </div>
    );
  }
});

module.exports = Body;
