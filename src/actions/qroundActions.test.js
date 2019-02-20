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

import * as actions from './qroundActions'
import * as types from './actionTypes'
import '../localStorageMock'
import fetchMock from 'fetch-mock'

const jsonHeaders = {'Content-Type': 'application/json'}

describe('qroundActions', () => {
  beforeEach(fetchMock.restore)

  it('should load qrounds', done => {
    fetchMock.getOnce('/api/test', {headers: jsonHeaders, body: {qrounds: [{id: 42}], stats: {competences: []}}})
    actions.loadQRounds('test')(action => {
      expect(action).toEqual({error: '', qrounds: [{id: 42}], stats: [], type: types.LOAD_QROUNDS_SUCCESS})
      done()
    })
  })

  it('should create a qround', done => {
    fetchMock.postOnce('/api/test', {headers: jsonHeaders, body: {result: {id: 42}}})
    actions.createQRound('test')(action => {
      expect(action).toEqual({error: '', qround: {id: 42}, type: types.CREATE_QROUNDS_SUCCESS})
      done()
    })
  })
})
