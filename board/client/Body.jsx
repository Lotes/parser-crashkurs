import React from 'react';
import Header from './Header.jsx';
import Player from './Player.jsx';
import Connection from './Connection';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    this.state = {
      connection: new Connection(() => {
        const comp = this;
        this.query = this.state.connection.connection.createSubscribeQuery('players', {$sort: {name: 1}});
        this.query.on('ready', update);
        this.query.on('changed', update);
        this.queryLogins = this.state.connection.connection.createSubscribeQuery('logins', {});
        this.queryLogins.on('ready', updateLogins);
        this.queryLogins.on('changed', updateLogins);

        function update() {
          comp.setState({players: comp.query.results});
        }

        function updateLogins() {
          comp.setState({logins: comp.queryLogins.results});
        }
      }),
      logins: [],
      players: []
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.query.destroy();
  }

  render() {
    if(!this.state.connection.playerId) {
      return (<CircularProgress/>);
    }
    const login = this.state.logins.find(doc => doc.id == this.state.connection.loginId) || { data: { playerId: this.state.connection.playerId } };
    const selection = this.state.players.find(doc => doc.id == login.data.playerId);
    const playerNodes = this.state.players.map(doc => <Tab key={doc.id} value={doc.id} label={<Player loginCount={this.state.logins.filter(lg => lg.data.playerId == doc.id).length} doc={doc}/>}/>);
    return (<div className="app">
        <div className="header">
          <div className="userListPane">
            <Header {...this.state}/>
          </div>
        </div>
        <div className="content">
          <Tabs
            value={selection.id} onChange={a => {}}>
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            {playerNodes}
          </Tabs>
          <TabContainer dir="ltr">

          </TabContainer>
        </div>
      </div>);
  }
}

export default Body;
