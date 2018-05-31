import React, { Component } from 'react'
import axios from 'axios'
import brace from 'brace'
import AceEditor from 'react-ace'
import { HotKeys } from 'react-hotkeys'
import Popup from 'react-popup'
import SimpleLoadingBar from 'react-simple-loading-bar'
import { Scrollbars } from 'react-custom-scrollbars'

import Prompt from './Prompt'
import OpenOption from './OpenOption'

import './App.css'

import 'brace/mode/c_cpp'
import 'brace/theme/monokai'

const SERVER = 'https://code-editor-server.herokuapp.com'
// const SERVER = 'http://localhost:5000'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fileName: false,
      fileCanBePushed: false,
      content: '',
      status: false,
      activeRequests: 0
    }

    this.onChange = this.onChange.bind(this)
    this.onPush = this.onPush.bind(this)
    this.onPull = this.onPull.bind(this)
    this.onNewFile = this.onNewFile.bind(this)
    this.onSelectFile = this.onSelectFile.bind(this)
    this.showOptions = this.showOptions.bind(this)

    let this_class = this

    Popup.registerPlugin('open', function(data) {
      let content

      if (!data.length) {
        content = 'No file is available at the moment.'
      } else {
        content = (
          <div className="file-select">
            <Scrollbars>
              <ul className="shortcut-list">
                {data.map(obj => (
                  <li
                    key={obj.name}
                    onClick={() => {
                      Popup.close()
                      this_class.setState({ fileName: obj.name }, () => {
                        this_class.onPull()
                      })
                    }}
                  >
                    <strong>{obj.name}</strong>
                  </li>
                ))}
              </ul>
            </Scrollbars>
          </div>
        )
      }

      this.create({
        title: 'Open File',
        content: content
      })
    })

    Popup.registerPlugin('newFile', function() {
      let promptValue = ''
      let promptChange = value => {
        promptValue = value
      }

      const content = (
        <div>
          <label htmlFor="fileName" className="fileNameLabel">
            Enter file name:
          </label>
          <br />
          <Prompt onChange={promptChange} />
        </div>
      )

      this.create({
        title: 'Create a new file',
        content: content,
        buttons: {
          right: [
            {
              text: 'Create',
              className: 'success',
              key: 'enter',
              action: function() {
                if (promptValue) {
                  Popup.close()
                  this_class.setState({ fileName: promptValue }, () => {
                    this_class.onPull()
                  })
                }
              }
            }
          ]
        }
      })
    })

    Popup.registerPlugin('remove', function(data) {
      let content

      if (!data.length) {
        content = 'No file is available at the moment.'
      } else {
        content = (
          <div className="file-select">
            <Scrollbars>
              <ul className="shortcut-list">
                {data.map(obj => (
                  <li
                    key={obj.name}
                    onClick={() => {
                      Popup.close()
                      this_class.removeFile(obj.name)
                    }}
                  >
                    <strong>{obj.name}</strong>
                  </li>
                ))}
              </ul>
            </Scrollbars>
          </div>
        )
      }

      this.create({
        title: 'Delete File',
        content: content
      })
    })
  }

  onChange(value) {
    this.setState({ fileCanBePushed: true, content: value })
  }

  onPush(e) {
    if (this.state.fileName) {
      this.setState({ status: 'Saving ...', activeRequests: 1 })

      axios
        .post(`${SERVER}/api/push`, {
          filename: this.state.fileName,
          content: this.state.content
        })
        .then(res => {
          const file = res.data

          this.setState({
            fileName: file.name,
            content: file.content,
            status: false,
            fileCanBePushed: false,
            activeRequests: 0
          })
        })
    }

    e && e.preventDefault()
  }

  onPull(e) {
    if (this.state.fileName) {
      this.setState({ status: 'Pulling ...', activeRequests: 1 })

      axios
        .post(`${SERVER}/api/pull`, {
          filename: this.state.fileName
        })
        .then(res => {
          const file = res.data

          this.setState({
            fileName: file.name,
            content: file.content,
            status: false,
            fileCanBePushed: false,
            activeRequests: 0
          })
        })
    }

    e && e.preventDefault()
  }

  removeFile(name) {
    this.setState({ activeRequests: 1 })

    if (this.state.fileName === name) {
      this.setState({
        fileName: false,
        content: ''
      })
    }

    axios
      .post(`${SERVER}/api/delete`, {
        filename: name
      })
      .then(res => {
        console.log(res)
        this.setState({ activeRequests: 0 })
      })
  }

  onNewFile(e) {
    Popup.plugins().newFile()

    e && e.preventDefault()
  }

  onSelectFile(e) {
    this.setState({ activeRequests: 1 })
    axios.post(`${SERVER}/api/query`).then(res => {
      this.setState({ activeRequests: 0 })
      const data = res.data
      Popup.plugins().open(data)
    })

    e && e.preventDefault()
  }

  onRemove(e) {
    this.setState({ activeRequests: 1 })
    axios.post(`${SERVER}/api/query`).then(res => {
      this.setState({ activeRequests: 0 })
      const data = res.data
      Popup.plugins().remove(data)
    })

    e && e.preventDefault
  }

  showOptions() {
    let this_class = this

    Popup.registerPlugin('shortcuts', function() {
      let content = (
        <ul className="shortcut-list main-shortcut">
          <li
            onClick={() => {
              Popup.close()
              this_class.onNewFile()
            }}
          >
            <strong>Create</strong>{' '}
            <span className="right">
              <code>Ctrl</code> + <code>Alt</code> + <code>N</code>
            </span>
          </li>
          <li
            onClick={() => {
              Popup.close()
              this_class.onRemove()
            }}
          >
            <strong>Delete</strong>{' '}
            <span className="right">
              <code>Ctrl</code> + <code>Alt</code> + <code>D</code>
            </span>
          </li>
          <li
            onClick={() => {
              Popup.close()
              this_class.onSelectFile()
            }}
          >
            <strong>Open</strong>{' '}
            <span className="right">
              <code>Ctrl</code> + <code>O</code>
            </span>
          </li>
          <li
            onClick={() => {
              Popup.close()
              this_class.onPush()
            }}
          >
            <strong>Push</strong>{' '}
            <span className="right">
              <code>Ctrl</code> + <code>S</code>
            </span>
          </li>
          <li
            onClick={() => {
              Popup.close()
              this_class.onPull()
            }}
          >
            <strong>Pull</strong>{' '}
            <span className="right">
              <code>Ctrl</code> + <code>R</code>
            </span>
          </li>
        </ul>
      )

      this.create({
        title: 'Options',
        content: content
      })
    })

    Popup.plugins().shortcuts()
  }

  render() {
    const keyMap = {
      push: 'ctrl+s',
      pull: 'ctrl+r',
      file: 'ctrl+o',
      createNewFile: 'ctrl+alt+n',
      deleteFile: 'ctrl+alt+d'
    }

    const handlers = {
      push: this.onPush,
      pull: this.onPull,
      file: this.onSelectFile,
      createNewFile: this.onNewFile,
      deleteFile: this.onRemove
    }

    const win = this.state.fileName ? (
      <AceEditor
        mode="c_cpp"
        theme="monokai"
        name="editor-goes-here"
        width="100%"
        height="97vh"
        fontSize={16}
        value={this.state.content}
        onLoad={editor => editor.focus()}
        onChange={this.onChange}
        setOptions={{ readOnly: !this.state.fileName }}
        editorProps={{ $blockScrolling: true }}
      />
    ) : (
      <OpenOption />
    )

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <SimpleLoadingBar
          activeRequests={this.state.activeRequests}
          color="#06bbff"
          height="0.15rem"
        />
        <Popup />
        <div className="App">
          {win}
          <div className="App-status-bar">
            <strong style={{ color: '#aaa' }}>{this.state.fileName}</strong>
            {this.state.fileName && ' - '}Code Editor. Use 'Ctrl + S' to push
            your code and 'Ctrl + R' to pull code from the server.{' '}
            {this.state.fileCanBePushed && 'Code is ready to be pushed. '}
            {this.state.status}
            <a className="option-menu-btn" onClick={this.showOptions}>
              Options
            </a>
          </div>
        </div>
      </HotKeys>
    )
  }
}

export default App
