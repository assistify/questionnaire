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
import {fetchDataWithAuth} from './miscActions'

function getErrorType(error) {
  return  error === 'Invalid token' ? types.LOGGED_OUT : types.SHOW_ERROR
}

export function loadQuestions(questionnaire) {
  return function (dispatch) {
    return fetchDataWithAuth('GET', '/' + questionnaire + '/questions')(dispatch)
      .then(questions => dispatch({type: types.LOAD_QUESTIONS_SUCCESS, questions}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}

export function deleteQuestion(questionnaire, question) {
  return function (dispatch) {
    return fetchDataWithAuth('DELETE', '/' + questionnaire + '/questions/' + question.id)(dispatch)
      .then(question => dispatch({type: types.DELETE_QUESTIONS_SUCCESS, question}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}

export function updateQuestion(questionnaire, question) {
  return function (dispatch) {
    const url = '/' + questionnaire + '/questions' + (question.id ? ('/' + question.id) : '')
    return fetchDataWithAuth(question.id ? 'PUT' : 'POST', url, question)(dispatch)
      .then(newQuestion => dispatch({type: types.UPDATE_QUESTIONS_SUCCESS, question, newQuestion}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}

export function setActiveQuestion(question) {
  return function (dispatch) {
    dispatch({type: types.SET_ACTIVE_QUESTION, question})
  }
}
