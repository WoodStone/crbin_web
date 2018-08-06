import axios from 'axios';
import createHistory from 'history/createBrowserHistory';
import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { Route, Router } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/styles/hljs';
const history = createHistory();

class App extends Component {
  state = {code: ""};

  newBin = () => { this.updateCode(""); history.push(""); }
  saveBin = () => axios.post("/bin", {data: this.state.code, src: "web"}).then(r => history.push(r.data.id));
  dublicateBin = () => history.push("");
  rawBin = () => history.push("raw" + history.location.pathname);
  fetchBin = (id) => axios.get("/bin/" + id).then(r => this.updateCode(r.data.data));
  updateCode = (code) => this.setState({code: code});

  render() {
    return (
      <Router history={history}>
        <div id="inner">
          <div id="menu">
            <ReactSVG className={"button"} path={"/svg/save.svg"} onClick={this.saveBin} />
            <ReactSVG className={"button"} path={"/svg/file-plus.svg"} onClick={this.newBin}/>
            <ReactSVG className={"button"} path={"/svg/copy.svg"} onClick={this.dublicateBin}/>
            <ReactSVG className={"button"} path={"/svg/code.svg"} onClick={this.rawBin}/>
          </div>

          <Route exact path="/" render={(props) => (
            <EditView {...props} onCodeChange={this.updateCode} code={this.state.code} />
          )}/>

          <Route path="/:id([a-f\d]{14,16})" render={(props) => (
            <CodeView {...props} onCodeChange={this.updateCode} code={this.state.code} fetchBin={this.fetchBin.bind(this)} />
          )} />

          <Route path="/raw/:id([a-f\d]{14,16})" render={(props) => (
            <RawCodeView {...props} code={this.state.code} fetchBin={this.fetchBin.bind(this)}/>
          )}/>

        </div>
      </Router>
    );
  }
}

class RawCodeView extends Component {

  componentWillMount() {
    if (this.props.code.length == 0) {
      this.props.fetchBin(this.props.match.params.id);
    }
  }

  render() {
    return (
      <pre className={"raw_code"}>{this.props.code}</pre>
    );
  }
}

const EditView = ({code, onCodeChange}) => (
  <textarea
    autoFocus
    value={code}
    onKeyDown={(event) => {
      // Tab support
      if (event.keyCode == 9) {
        event.preventDefault();
        var target = event.target;
        var val = target.value;
        var start = target.selectionStart;
        var end = target.selectionEnd;
        target.value = val.substring(0, start) + "  " + val.substring(end);
        target.selectionStart = target.selectionEnd = start + 2;

        onCodeChange(target.value);
        return false;
      }
    }}
    onChange={(event) => onCodeChange(event.target.value)}
  />
);

class CodeView extends Component {

  componentWillMount() {
    this.props.fetchBin(this.props.match.params.id);
  }

  render() {
    return (
      <SyntaxHighlighter showLineNumbers style={atomOneDark}>{this.props.code}</SyntaxHighlighter>
    );
  }
}

export default App;
