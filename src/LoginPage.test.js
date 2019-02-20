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

import React from 'react' // eslint-disable-line no-unused-vars
import {shallow} from 'enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

const mockStore = configureMockStore([thunk])
Enzyme.configure({adapter: new Adapter()})

import LoginPage from './LoginPage' // eslint-disable-line no-unused-vars
import {Redirect} from 'react-router-dom'
import * as types from './actions/actionTypes'

const jsonHeaders = {'content-type': 'application/json'}

describe('Login page', () => {
  beforeEach(fetchMock.restore)

  it('has the correct title', () => {
    const store = mockStore({misc: {error: ''}})
    const wrapper = shallow(<LoginPage store={store}/>)
    const h1 = wrapper.dive().find('h1')
    expect(h1.length).toEqual(1)
    expect(h1.hasClass('App-title')).toEqual(true)
    expect(h1.text()).toEqual('Anmelden')
  })

  it('renders login fields', () => {
    const store = mockStore({misc: {error: ''}})
    const wrapper = shallow(<LoginPage store={store}/>)
    const labels = wrapper.dive().find('label')
    expect(labels.length).toEqual(2)
    expect(labels.at(0).text()).toEqual('Benutzername')
    expect(labels.at(1).text()).toEqual('Passwort')
  })

  it('has a submit button', () => {
    const store = mockStore({misc: {error: ''}})
    const wrapper = shallow(<LoginPage store={store}/>)
    const button = wrapper.dive().find('button')
    expect(button.length).toEqual(1)
    expect(button.prop('type')).toEqual('submit')
    expect(button.hasClass('btn')).toEqual(true)
    expect(button.hasClass('btn-primary')).toEqual(true)
    expect(button.text()).toEqual('Anmelden')
  })

  it('displays errors', () => {
    const store = mockStore({misc: {error: 'an error occured'}})
    const wrapper = shallow(<LoginPage store={store}/>)
    const error = wrapper.dive().find('.alert')
    expect(error.length).toEqual(1)
    expect(error.hasClass('alert-danger')).toEqual(true)
    expect(error.text()).toEqual('an error occured')
  })

  it('redirects if already logged in', () => {
    const store = mockStore({misc: {error: '', isLoggedIn: true}})
    const wrapper = shallow(<LoginPage store={store} location={{state: {from: {pathname: "/loggedIn"}}}}/>)
    const redirect = wrapper.dive().find(Redirect)
    expect(redirect.length).toEqual(1)
    expect(redirect.prop('to').pathname).toEqual('/loggedIn')
  })

  it('defaults to / if no location state exists', () => {
    const store = mockStore({misc: {error: '', isLoggedIn: true}})
    const wrapper = shallow(<LoginPage store={store} location={{}}/>)
    const redirect = wrapper.dive().find(Redirect)
    expect(redirect.length).toEqual(1)
    expect(redirect.prop('to').pathname).toEqual('/')
  })

  it('tries to log in if form is submitted', () => {
    let defaultPrevented = false
    const store = mockStore({misc: {error: ''}})
    const wrapper = shallow(<LoginPage store={store}/>)
    fetchMock.postOnce('/api/signin', {body: {token: 'secret-token'}, headers: jsonHeaders})
    wrapper.dive().find('form').simulate('submit', {
      preventDefault: () => defaultPrevented = true,
      target: {username: {value: 'name'}, password: {value: 'pwd'}}
    })
    fetchMock.flush().then(() => {
      expect(store.getActions()).toEqual([{type: types.SEND_LOGIN_DATA}])
      expect(defaultPrevented).toEqual(true)
    })
  })

  it('handles status codes when /signin fails', () => {
    const store = mockStore({misc: {error: ''}})
    const wrapper = shallow(<LoginPage store={store}/>)
    fetchMock.postOnce('/api/signin', {status: 500, body: 'an error occured', headers: jsonHeaders})
    wrapper.dive().find('form').simulate('submit', {
      preventDefault: () => {},
      target: {username: {value: 'name'}, password: {value: 'pwd'}}
    })
    fetchMock.flush().then(() => {
      expect(store.getActions()).toEqual([{type: types.SEND_LOGIN_DATA}])
    })
  })

  it('handles error results from /signin fails', () => {
    const store = mockStore({misc: {error: ''}})
    const wrapper = shallow(<LoginPage store={store}/>)
    fetchMock.postOnce('/api/signin', {body: {error: 'an error occured'}, headers: jsonHeaders})
    wrapper.dive().find('form').simulate('submit', {
      preventDefault: () => {},
      target: {username: {value: 'name'}, password: {value: 'pwd'}}
    })
    fetchMock.flush().then(() => {
      expect(store.getActions()).toEqual([{type: types.SEND_LOGIN_DATA}])
    })
  })
})
