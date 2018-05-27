import React from 'react'

export default class Prompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      isRed: false
    }

    this.onChange = e => this._onChange(e)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onChange(this.state.value)
    }
  }

  _onChange(e) {
    let value = e.target.value

    this.setState({ value: value, isRed: value ? false : true })
  }

  render() {
    return (
      <input
        type="text"
        className={this.state.isRed ? 'fileNameInput red' : 'fileNameInput'}
        value={this.state.value}
        onChange={this.onChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    )
  }
}
