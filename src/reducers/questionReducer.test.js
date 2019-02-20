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

import reducer from './questionReducer'
import * as types from '../actions/actionTypes'

describe('questionReducer', () => {
  it('should return the inital state', () => {
    expect(reducer(undefined, {})).toEqual({active: null, list: []})
  })

  it('should handle LOAD_QUESTIONS_SUCCESS', () => {
    expect(reducer({list: [], active: null}, {type: types.LOAD_QUESTIONS_SUCCESS, questions: [{id: 1}, {id: 2}]}))
      .toEqual({active: null, list: [{id: 1}, {id: 2}]})
  })

  it('should handle DELETE_QUESTIONS_SUCCESS', () => {
    expect(reducer({list: [{id: 1}, {id: 2}, {id: 3}], active: {id: 2}}, {type: types.DELETE_QUESTIONS_SUCCESS, question: {id: 2}}))
      .toEqual({active: null, list: [{id: 1}, {id: 3}]})
  })

  it('should handle UPDATE_QUESTIONS_SUCCESS with a new question', () => {
    const question = {id: 2, title: 'new'}
    expect(reducer({list: [{id: 1}], active: null}, {type: types.UPDATE_QUESTIONS_SUCCESS, question: {}, newQuestion: question}))
      .toEqual({active: question, list: [{id: 1}, question]})
  })

  it('should handle UPDATE_QUESTIONS_SUCCESS with a changed question', () => {
    const question = {id: 2, title: 'changed'}
    expect(reducer({list: [{id: 1}, {id: 2}], active: null}, {type: types.UPDATE_QUESTIONS_SUCCESS, question, newQuestion: question}))
      .toEqual({active: null, list: [{id: 1}, question]})
  })
})
