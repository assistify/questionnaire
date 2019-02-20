/*
Copyright 2018-2019 Justso GmbH, Frankfurt, Germany

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {sendLoginData} from './actions/miscActions'

class LoginPage extends Component {
  login(event) {
    event.preventDefault()
    return this.props.sendLoginData(event.target.username.value, event.target.password.value)
  }

  redirectDestination() {
    const locationState = this.props.location.state
    const pathname = locationState && locationState.from.pathname
    return {
      pathname: pathname || '/',
      state: {from: this.props.location}
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to={this.redirectDestination()}/>
    } else {
      return <div>
        <header className="App-header">
          <h1 className="App-title">Anmelden</h1>
        </header>

        <form onSubmit={e => this.login(e)}>
          <div className="form-group">
            <label>Benutzername</label>
            <input type="text" autoFocus className="form-control" name="username" autoComplete="username"/>
          </div>
          <div className="form-group">
            <label>Passwort</label>
            <input type="password" className="form-control" name="password" autoComplete="current-password"/>
          </div>
          {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}
          <button type="submit" className="btn btn-primary">Anmelden</button>
        </form>
      </div>
    }
  }
}

function mapStateToProps(state) {
  return {
    error: state.misc.error,
    isLoggedIn: state.misc.isLoggedIn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({sendLoginData}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
