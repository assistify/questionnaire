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

import reducer from './miscReducer'
import * as types from '../actions/actionTypes'

describe('miscReducer', () => {
  it('should return the inital state', () => {
    expect(reducer(undefined, {})).toEqual({error: null, isLoggedIn: false, redirectUrl: null})
  })

  it('should handle SHOW_ERROR', () => {
    expect(reducer([], {type: types.SHOW_ERROR, text: 'error text'})).toEqual({error: 'error text'})
  })

  it('should handle LOGGED_INT', () => {
    expect(reducer([], {type: types.LOGGED_IN})).toEqual({isLoggedIn: true})
  })

  it('should handle LOGGED_OUT', () => {
    expect(reducer([], {type: types.LOGGED_OUT})).toEqual({isLoggedIn: false, redirectUrl: 'login'})
  })
})
