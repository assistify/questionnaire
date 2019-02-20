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

import * as types from '../actions/actionTypes'

export default function questionReducer(state = {list: [], active: null}, action) {
  switch (action.type) {
    case types.LOAD_QUESTIONS_SUCCESS:
      return Object.assign({}, state, {list: action.questions, active: null})
    case types.DELETE_QUESTIONS_SUCCESS:
      return Object.assign({}, state, {list: state.list.filter(q => q.id !== action.question.id), active: null})
    case types.UPDATE_QUESTIONS_SUCCESS:
      if (action.question.id) {
        return Object.assign({}, state, {list: state.list.map(q => q.id === action.question.id ? action.newQuestion : q)})
      } else {
        return Object.assign({}, state, {list: state.list.concat([action.newQuestion]), active: action.newQuestion})
      }
    case types.SET_ACTIVE_QUESTION:
      return Object.assign({}, state, {active: action.question})
    default:
      return state
  }
}
