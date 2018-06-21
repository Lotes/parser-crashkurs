import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PlayIcon from '@material-ui/icons/PlayArrow';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

class Runner extends React.Component {
  constructor(props) {
    super(props);
    //connection: Connection
    this.state = {
      error: '',
      output: ''
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  parserInputChanged(event) {
    axios.post('/run/'+this.props.connection.playerId, {
      input: event.target.value
    })
    .then((response) => {
      this.setState({
        output: response.data.output,
        error: response.data.error
      });
    })
    .catch((error) => {
      this.setState({
        error: error.message
      });
    });
  }

  render() {
    return (
      <div>
        <Toolbar className="runner-bar">
          <Typography>Playground</Typography>
        </Toolbar>
        <TextField
          label="Input"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Please enter the parser input!"
          fullWidth
          onChange={this.parserInputChanged.bind(this)}
          margin="normal"
        />
        <Typography>Output: {this.state.output}</Typography>
        <Typography>Error: <code>{this.state.error}</code></Typography>
      </div>
    );
  }
}

export default Runner;
