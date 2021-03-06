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
import Runner from './Runner.jsx';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} className="tabsBody">
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

    if(selection) {
      return (<div className="app">
            <Header className="appHeader" connection={this.connection}/>
            <Tabs
               className="tabsHeader"
               value={selection.id} onChange={this.handleTabChanged.bind(this)}>
               scrollable
               scrollButtons="on"
               indicatorColor="primary"
               textColor="primary">
               {tabs}
             </Tabs>
             <div className="tabsBody">
               <div className="tabsBodyContent">
                 <div className="editor">
                   <Editor connection={this.connection}/>
                 </div>
                 <div className="runner">
                   <Runner connection={this.connection}/>
                 </div>
               </div>
            </div>
        </div>);
    } else {
      return (<div className="app">
            <CircularProgress/>
        </div>);
    }
  }
}

export default Body;
