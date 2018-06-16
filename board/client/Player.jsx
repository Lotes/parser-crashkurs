import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import React from 'react';

class Player extends React.Component {
  //propTypes: {
  //  doc: React.PropTypes.object.isRequired
  //},

  constructor(props) {
    super(props);
  }

  handleClick(event) {

  }

  componentDidMount() {
    var comp = this;
    var doc = comp.props.doc;
    doc.subscribe();
    doc.on('load', update);
    doc.on('op', update);
    function update() {
      // `comp.props.doc.data` is now updated. re-render component.
      comp.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.doc.unsubscribe();
  }

  render() {
    return (
      <div className="player">
        <Badge color="primary" badgeContent={4}>
          <Chip
            avatar={<Avatar src={"dist/avatars-"+this.props.doc.data.avatarId+".png"} />}
            label={this.props.doc.data.name}
          />
        </Badge>
      </div>
    );
  }
}

export default Player;
