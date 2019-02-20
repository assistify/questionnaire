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
import {Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

export const ProtectedRoute = ({component: ComposedComponent, ...rest}) => {
  class Authentication extends Component {
    handleRender(props) {
      if (!this.props.isLoggedIn && !localStorage.getItem('token')) {
        return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
      } else {
        return <ComposedComponent {...props}/>
      }
    }

    render() {
      return <Route {...rest} render={this.handleRender.bind(this)}/>
    }
  }

  function mapStateToProps(state) {
    return {isLoggedIn: state.misc.isLoggedIn}
  }

  const AuthenticationContainer = connect(mapStateToProps)(Authentication)
  return <AuthenticationContainer/>
}
