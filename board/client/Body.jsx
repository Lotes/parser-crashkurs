import React from 'react';
import Header from './Header.jsx';
import Player from './Player.jsx';
import Connection from './Connection';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Editor from './Editor.jsx';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

class Body extends React.Component{
  constructor(props) {
    super(props);
    this.connection = new Connection();
    this.connection.on('ready', () => this.forceUpdate());
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    
  }

  handleTabChanged(event, value) {
    this.connection.setSource(value);
    this.forceUpdate();
  }

  render() {
    if(!this.connection.playerId) {
      return (<CircularProgress/>);
    }
    const login = this.connection.getLogin(this.connection.loginId);
    const tabs = this.connection.players.map(doc => <Tab key={doc.id} value={doc.id} label={<Player doc={doc} connection={this.connection}/>}/>);
    const selection = this.connection.getPlayer(login.data.playerId);
    var content = (<CircularProgress/>);
    if(selection)
      content = (<div>
         <Tabs
            value={selection.id} onChange={this.handleTabChanged.bind(this)}>
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary">
            {tabs}
          </Tabs>
          <TabContainer dir="ltr">
            <Editor connection={this.connection}/>
          </TabContainer>
        </div>);
    return (<div className="app">
        <div className="header">
          <div className="userListPane">
            <Header connection={this.connection}/>
          </div>
        </div>
        <div className="content">
          {content}
        </div>
      </div>);
  }
}

export default Body;
