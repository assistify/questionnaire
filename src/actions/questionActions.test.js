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

import * as actions from './questionActions'
import * as types from './actionTypes'
import {localStorage} from '../localStorageMock'
import fetchMock from 'fetch-mock'

const jsonHeaders = {'Content-Type': 'application/json'}
global.localStorage = localStorage

describe('questionActions', () => {
  beforeEach(fetchMock.restore)

  it('should load questions', () => {
    fetchMock.getOnce('/api/test/questions', {body: [{id: 42}], headers: jsonHeaders})
    actions.loadQuestions('test')(action => {
      expect(action).toEqual({questions: [{id: 42}], type: types.LOAD_QUESTIONS_SUCCESS})
    })
  })

  it('should delete a question', () => {
    const question = {id: 42, title: 'test-question'}
    fetchMock.deleteOnce('/api/test/questions/42', {body: question})
    actions.deleteQuestion('test', question)(action => {
      expect(action).toEqual({question, type: types.DELETE_QUESTIONS_SUCCESS})
    })
  })

  it('should create a question', () => {
    const question = {title: 'test-question'}
    fetchMock.postOnce('/api/test/questions', {body: question})
    actions.updateQuestion('test', question)(action => {
      expect(action).toEqual({question, newQuestion: question, type: types.UPDATE_QUESTIONS_SUCCESS})
    })
  })

  it('should update a question', () => {
    const question = {id: 42, title: 'test-question'}
    fetchMock.putOnce('/api/test/questions/42', {body: question})
    actions.updateQuestion('test', question)(action => {
      expect(action).toEqual({question, newQuestion: question, type: types.UPDATE_QUESTIONS_SUCCESS})
    })
  })
})
