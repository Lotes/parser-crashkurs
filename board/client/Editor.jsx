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
    this.loginDocuments = new Map(); //login-id -> { login-doc, cursor }
    this.handlerReattachEditor = (editor) => this.reattachEditor(editor);
    this.handlerLoginsChanged = () => this.loginsChanged();
    this.handlerLoginChanged = (doc) => this.loginChanged(doc);
    this.handlerCursorChanged = editor => this.cursorChanged(editor);
  }

  componentDidMount() {
    const textArea = ReactDOM.findDOMNode(this);
    const editor = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true,
      mode: { name: 'ebnf' },
      matchBrackets: true
    });
    this.attachEditor(editor);
    editor.on('cursorActivity', this.handlerCursorChanged)
    this.props.connection.on('sourceChanged', this.handlerReattachEditor);
    this.props.connection.on('loginsChanged', this.handlerLoginsChanged);
    this.editor = editor;
  }

  componentWillUnmount() {
    this.detachEditor();
    this.props.connection.off('sourceChanged', this.handlerReattachEditor);
    this.props.connection.off('loginsChanged', this.handlerLoginsChanged);
    this.editor = null;
  }

  cursorChanged(editor) {
    const connection = this.props.connection;
    const head = editor.getCursor('head');
    const anchor = editor.getCursor('anchor');
    connection.setCursor(head, anchor);
  }

  loginChanged(doc) {
    /*const connection = this.props.connection;
    const myLogin = connection.getLogin(connection.loginId);
    if(doc.data.playerId !== myLogin.data.playerId)
    {
      if(doc.data.playerId == -1)
        this.updateMarkerFor(doc);
      return;
    }
    this.updateMarkerFor(doc);*/
  }

  updateMarkerFor(login) {
    const id = login.id;
    const obj = this.loginDocuments.get(id);
    if(!obj)
      return;
    const doc = this.editor.getDoc();
    const head = { line: login.data.headLine, ch: login.data.headCh };
    const anchor = { line: login.data.anchorLine, ch: login.data.anchorCh };
    const headFirst = head.line < anchor.line || (head.line === anchor.line && head.ch < anchor.ch);
    const from = headFirst ? head : anchor;
    const to = headFirst ? anchor : head;
    if(obj.marker) {
      obj.marker.clear();
    }
    const marker = doc.markText(from, to, {className: "marked"});
    obj.marker = marker;
  }

  loginsChanged() {
    const connection = this.props.connection;
    const newDocuments = new Map();
    connection.logins.forEach(doc => {
      if(this.loginDocuments.has(doc.id)) {
        //already known
        const obj = this.loginDocuments.get(doc.id);
        this.loginDocuments.delete(doc.id);
        newDocuments.set(doc.id, doc);
      } else {
        //new document
        const obj = {doc:doc, handler: () => this.loginChanged(doc) }
        newDocuments.set(doc.id, obj);
        doc.subscribe(err => {
          doc.on('load', obj.handler);
          doc.on('op', obj.handler);
        });
        this.handlerLoginChanged(doc);
      }
    });
    //forgotten document
    this.unsubscribeLogins();
    //set the new documents
    this.loginDocuments = newDocuments;
  }

  unsubscribeLogins() {
    for(var [key, value] of this.loginDocuments) {
      value.doc.removeListener('load', value.handler);
      value.doc.removeListener('op', value.handler);
    }
  }

  reattachEditor(editor) {
    this.detachEditor();
    this.attachEditor(editor);
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
      <textarea className="maxHeight"/>
    );
  }
}

export default Editor;
