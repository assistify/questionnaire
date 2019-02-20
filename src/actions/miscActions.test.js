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

import * as actions from './miscActions'
import * as types from './actionTypes'
import '../localStorageMock'
import fetchMock from 'fetch-mock'

const jsonHeaders = {'Content-Type': 'application/json'}
const textHeaders = {'Content-Type': 'text/plain'}

describe('miscActions', () => {
  beforeEach(fetchMock.restore)

  it('should create an action to log out', () => {
    localStorage.setItem('token', 'abcdef')
    expect(actions.loggedOut()).toEqual({type: types.LOGGED_OUT})
    expect(localStorage.getItem('token')).toEqual(null)
  })

  it('should create an action to log in', () => {
    expect(actions.loggedIn('abcdef')).toEqual({type: types.LOGGED_IN})
    expect(localStorage.getItem('token')).toEqual('abcdef')
  })

  it('should fetch data with auth', done => {
    localStorage.setItem('token', '4711')
    fetchMock.restore()
    fetchMock.getOnce('/api/test', {body: {result: 456}, headers: jsonHeaders})
    actions.fetchDataWithAuth('GET', '/test', {data: 123})(() => {})
      .then(result => {
        expect(result).toEqual({result: 456})
        const call = fetchMock.calls()[0]
        expect(call[1].headers.Authorization).toEqual('4711')
        expect(call[1].body).toEqual('{"data":123}')
        done()
      })
  })

  it('should handle http errors on fetch data with auth', done => {
    fetchMock.getOnce('/api/test', {status: 500, body: 'an error occured', headers: textHeaders})
    actions.fetchDataWithAuth('GET', '/test', {data: 123})(action => {
      expect(action).toEqual({type: types.SHOW_ERROR, text: 'Internal Server Error'})
    }).catch(error => {
      expect(error).toEqual('Internal Server Error')
      done()
    })
  })

  it('should handle other errors on fetch data with auth', done => {
    fetchMock.getOnce('/api/test', {body: {error: 'invalid parameters'}, headers: jsonHeaders})
    actions.fetchDataWithAuth('GET', '/test', {data: 123})(action => {
      expect(action).toEqual({type: types.SHOW_ERROR, text: 'invalid parameters'})
    }).catch(error => {
      expect(error).toEqual('invalid parameters')
      done()
    })
  })

  it('should handle invalid tokens on fetch data with auth', done => {
    fetchMock.getOnce('/api/test', {status: 401, body: 'invalid token', headers: textHeaders})
    actions.fetchDataWithAuth('GET', '/test', {data: 123})(action => {
      expect(action).toEqual({type: types.LOGGED_OUT})
    }).catch(error => {
      expect(error).toEqual('Invalid token')
      done()
    })
  })
})
