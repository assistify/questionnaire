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

export function loadQRounds(questionnaire) {
  return function (dispatch) {
    return fetchDataWithAuth('GET', '/' + questionnaire)(dispatch)
      .then(result => dispatch({type: types.LOAD_QROUNDS_SUCCESS, qrounds: result.qrounds, stats: result.stats.competences, error: ''}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}

export function loadQRoundData(questionnaire, qround) {
  return function (dispatch) {
    return fetchDataWithAuth('GET', '/' + questionnaire + '/qround/' + qround)(dispatch)
      .then(qroundData => dispatch({type: types.LOAD_QROUNDDATA_SUCCESS, qroundData: qroundData.result, error: ''}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}

export function createQRound(questionnaire) {
  return function (dispatch) {
    return fetchDataWithAuth('POST', '/' + questionnaire)(dispatch)
      .then(qround => dispatch({type: types.CREATE_QROUNDS_SUCCESS, qround: qround.result, error: ''}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}

export function updateQRound(questionnaire, qround) {
  return function (dispatch) {
    return fetchDataWithAuth('PUT', `/${questionnaire}/qround/${qround.id}`, qround)(dispatch)
      .then(qround => dispatch({type: types.UPDATE_QROUND_SUCCESS, qround, error: ''}))
      .catch(error => dispatch({type: getErrorType(error), error}))
  }
}
