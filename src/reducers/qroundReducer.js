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

export default function qroundReducer(state = {list: [], data: []}, action) {
  switch (action.type) {
    case types.LOAD_QROUNDS_SUCCESS:
      return {...state, list: action.qrounds, stats: action.stats}
    case types.LOAD_QROUNDDATA_SUCCESS:
      return {...state, data: action.qroundData}
    case types.CREATE_QROUNDS_SUCCESS:
      return {...state, list: state.list.concat([action.qround])}
    case types.UPDATE_QROUND_SUCCESS:
      return {...state, list: state.list.map(round => round.id === action.qround.id ? action.qround : round)}
    default:
      return state
  }
}
