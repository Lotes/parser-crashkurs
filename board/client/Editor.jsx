import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Player from './Player.jsx';
import Connection from './Connection';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import StringBinding from './codemirror-sharedb-string-binding';

class Editor extends React.Component{
  constructor(props) {
    super(props);
    //connection: Connection
  }

  componentDidMount() {
    const textArea = ReactDOM.findDOMNode(this);
    const editor = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true
    });
    editor.setOption('mode', 'ebnf');
    this.attachEditor(editor);
    this.props.connection.on('sourceChanged', () => {
      this.detachEditor();
      this.attachEditor(editor);
    });
  }

  componentWillUnmount() {
    console.log('doc');
    this.detachEditor();
  }

  attachEditor(editor) {
    const self = this;
    const login = this.props.connection.getLogin(this.props.connection.loginId);
    const doc = this.props.connection.getPlayer(login.data.playerId);
    doc.subscribe(err => {
      if (err) throw err;
      const binding = new StringBinding(editor, doc, ['source']);
      binding.setup();
      self.binding = binding;
    });
  }

  detachEditor() {
    if(this.binding)
      this.binding.destroy();
  }

  render() {
    return (
      <textarea className="editor"/>
    );
  }
}

export default Editor;
