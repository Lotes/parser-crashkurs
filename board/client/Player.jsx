import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import React from 'react';

class Player extends React.Component {
  //propTypes: {
  //  doc: React.PropTypes.object.isRequired
  //  connection
  //},

  constructor(props) {
    super(props);
    this.state = {
      loginCount: 0
    };
  }

  handleLoginsChanged() {
    const self = this;
    this.props.connection.logins.forEach(doc => {
      doc.subscribe(err => {
        if(err) throw err;
        doc.removeListener('load', this.loginHandler);
        doc.removeListener('op', this.loginHandler);
        doc.on('load', this.loginHandler);
        doc.on('op', this.loginHandler);
      });
    });
    this.handleLoginChanged();
  }

  handleLoginChanged() {
    this.setState({
      loginCount: this.props.connection.logins.filter(login => login.data.playerId == this.props.doc.id).length
    });
    this.forceUpdate();
  }

  componentDidMount() {
    var doc = this.props.doc;
    doc.subscribe(err => {
      if(err) throw err;
      this.loginHandler = this.handleLoginChanged.bind(this);
      doc.on('load', this.loginHandler);
      doc.on('op', this.loginHandler);
      this.loginsHandler = this.handleLoginsChanged.bind(this);
      this.props.connection.queryLogins.on('ready', this.loginsHandler);
      this.props.connection.queryLogins.on('changed', this.loginsHandler);
    });
    this.handleLoginChanged();
  }

  componentWillUnmount() {
    this.props.connection.queryLogins.removeListener('ready', this.loginsHandler);
    this.props.connection.queryLogins.removeListener('changed', this.loginsHandler);
    this.loginsHandler = null;
  }

  render() {
    return (
      <div className="player">
        <Badge color="secondary" badgeContent={this.state.loginCount}>
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
