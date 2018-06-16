import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import React from 'react';

class Player extends React.Component {
  //propTypes: {
  //  doc: React.PropTypes.object.isRequired
  //  queryLogins: list of logins
  //},

  constructor(props) {
    super(props);
    this.state = {
      loginCount: 0
    };
  }

  handleLoginsChanged() {
    const self = this;
    this.props.queryLogins.results.forEach(doc => {
      doc.subscribe();
      function updateLoad() {
        self.handleLoginChanged();
        doc.once('load', updateLoad);
      }
      doc.once('load', updateLoad);
      function updateOp() {
        self.handleLoginChanged();
        doc.once('op', updateOp);
      }
      doc.once('op', updateOp);
    });

    this.handleLoginChanged();
  }

  handleLoginChanged() {
    this.setState({
      loginCount: this.props.queryLogins.results.filter(login => login.data.playerId == this.props.doc.id).length
    });
    this.forceUpdate();
  }

  componentDidMount() {
    var comp = this;
    var doc = comp.props.doc;
    doc.subscribe();
    this.loginHandler = this.handleLoginChanged.bind(this);
    doc.on('load', this.loginHandler);
    doc.on('op', this.loginHandler);
    this.loginsHandler = this.handleLoginsChanged.bind(this);
    this.props.queryLogins.on('ready', this.loginsHandler);
    this.props.queryLogins.on('changed', this.loginsHandler);
  }

  componentWillUnmount() {
    this.doc.unsubscribe();
    this.props.queryLogins.removeListener('ready', this.loginsHandler);
    this.props.queryLogins.removeListener('changed', this.loginsHandler);
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
