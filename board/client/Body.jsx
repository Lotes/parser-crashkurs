import React from 'react';
import Header from './Header.jsx';
import Player from './Player.jsx';
import Connection from './Connection';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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

        function update() {
          comp.setState({players: comp.query.results});
        }
      }),
      players: []
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.query.destroy();
  }

  render() {
    const playerNodes = this.state.players.map(doc => <Tab label={<Player doc={doc}/>}/>);
    return (<div className="app">
        <div className="header">
          <div className="userListPane">
            <Header {...this.state}/>
          </div>
        </div>
        <div className="content">
          <div className="tabs">
            <Tabs
              onChange={() => {}}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              {playerNodes}
            </Tabs>
            <TabContainer dir="rtl">
            lol
            </TabContainer>
          </div>
        </div>
      </div>);
  }
}

export default Body;
