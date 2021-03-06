import React from 'react';
import _ from 'underscore';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
const avatars = [0,1,2,3,4,5,6,7,8,9];

class Header extends React.Component {
  //propTypes: {
  //  players: React.PropTypes.array.isRequired,
  //  connection: React.PropTypes.object.isRequired
  //},

  constructor(props) {
    super(props);
    this.state = {open: false, editName: '', editAvatarId: 0};
  }

  editButtonClicked() {
    const doc = this.props.connection.getPlayer(this.props.connection.playerId);
    if(doc)
      this.setState({
        open: true,
        editName: doc.data.name,
        editAvatarId: doc.data.avatarId
      });
  }

  handleConfirm() {
    this.setState({
      open: false
    })
    const avatarId = this.state.editAvatarId;
    const doc = this.props.connection.getPlayer(this.props.connection.playerId);
    if(!doc)
      return;
    this.props.connection.setAvatar(this.state.editAvatarId);
    this.props.connection.setName(this.state.editName);
  }

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={this.editButtonClicked.bind(this)}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Dialog open={this.state.open} aria-labelledby="simple-dialog-title">
            <DialogTitle id="simple-dialog-title">Edit your avatar</DialogTitle>
            <DialogContent>
              <RadioGroup className="avatars" onChange={(event, value) => this.setState({ editAvatarId: parseInt(value, 10) })}>
                {avatars.map(avatar => (
                  <Radio
                    key={avatar}
                    icon={<Avatar className={this.state.editAvatarId == avatar ? 'checked' : 'unchecked'} src={"dist/avatars-"+avatar+".png"}/>}
                    checked={this.state.editAvatarId == avatar}
                    value={avatar.toString()}>
                  </Radio>
                ))}
              </RadioGroup>
              <TextField
                fullWidth
                label="Name"
                value={this.state.editName}
                onChange={(e) => this.setState({ editName: e.target.value })}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleConfirm.bind(this)} color="primary" autoFocus>
                OK
              </Button>
              <Button onClick={() => this.setState({open: false})} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Typography variant="title" color="inherit">
            Parsing board
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
