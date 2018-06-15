var { Button } = require('muicss/react');
var React = require('react');
var classNames = require('classnames');

var Player = React.createClass({
  propTypes: {
    doc: React.PropTypes.object.isRequired
  },

  handleClick: function(event) {

  },

  componentDidMount: function() {
    var comp = this;
    var doc = comp.props.doc;
    doc.subscribe();
    doc.on('load', update);
    doc.on('op', update);
    function update() {
      // `comp.props.doc.data` is now updated. re-render component.
      comp.forceUpdate();
    }
  },

  componentWillUnmount: function() {
    this.doc.unsubscribe();
  },

  render: function() {
    var classes = {
      'player': true
    };

    return (
      <div className={classNames(classes)}>
        <Button color="primary" onClick={this.handleClick}>{this.props.doc.data.name}</Button>
      </div>
    );
  }
});

module.exports = Player;
