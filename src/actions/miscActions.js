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

import * as types from './actionTypes'

export function showError(text) {
  return {type: types.SHOW_ERROR, text}
}

export function loggedOut() {
  localStorage.removeItem('token')
  return {type: types.LOGGED_OUT}
}

export function loggedIn(token) {
  localStorage.setItem('token', token)
  return {type: types.LOGGED_IN}
}

export function sendLoginData(username, password) {
  return function (dispatch) {
    dispatch({type: types.SEND_LOGIN_DATA})
    return fetch('/api/signin', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    })
      .then(result => result.ok ? result.json() : Promise.reject(result.statusText))
      .then(result => result.error ? Promise.reject(result.error) : result)
      .then(data => dispatch(loggedIn(data.token)))
      .catch(error => dispatch(showError(error)))
  }
}

export function fetchDataWithAuth(method, url, data) {
  return function (dispatch) {
    return fetch('/api' + url, {
      method,
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(result => {
        const contentType = result.headers.get('content-type')
        return Promise.all([result, contentType && contentType.match(/json/) ? result.json() : result.text()])
      })
      .then(([result, content]) => result.ok ? content : Promise.reject({status: result.status, statusText: result.statusText, content}))
      .then(result => result.error ? Promise.reject(result.error) : result)
      .catch(error => {
        if (error.status === 401) {
          dispatch(loggedOut())
          error = 'Invalid token'
        } else if (error.statusText) {
          dispatch(showError(error.statusText))
          error = error.statusText
        } else {
          dispatch(showError(error))
        }
        return Promise.reject(error)
      })
  }
}
