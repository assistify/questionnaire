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
import {createMockStore} from 'redux-test-utils'

Enzyme.configure({adapter: new Adapter()})

import App from './App' // eslint-disable-line no-unused-vars
import StartPage from './StartPage'

const store = createMockStore({})

global.fetch = () => new Promise(resolve => {
  resolve({
    ok: true, json: () => ({
      questionnaire: {title: 'Test title', greeting: 'Hello world', description: 'This is it'}
    })
  })
})

describe('App', () => {
  it('renders a header with the correct css class name', () => {
    const props = {
      store,
      match: {
        params: {
          questionnaire: '42'
        }
      }
    }
    const component = shallow(<App {...props}/>)
    const header = component.find('header').at(0)
    expect(header.hasClass('App-header')).toEqual(true)
  })

  it('shows the start page intitially', () => {
    const props = {
      store,
      match: {
        params: {
          questionnaire: '42'
        }
      }
    }
    const component = shallow(<App {...props}/>)
    expect(component.find(StartPage).length).toEqual(1)
  })
})
