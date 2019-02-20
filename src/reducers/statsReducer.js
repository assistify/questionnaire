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

export default function statsReducer(state = {}, action) {
  switch (action.type) {
    case types.LOAD_GLOBAL_STATS_SUCCESS:
      return Object.assign({}, state, {
        global: {
          numAssessments: action.numAssessments,
          categoryStats: action.categoryStats,
          detailStats: action.detailStats,
          competenceStats: action.competenceStats,
          analytics: action.analytics
        }
      })

    case types.LOAD_QROUND_STATS_SUCCESS:
      return Object.assign({}, state, {
        qround: {
          numAssessments: action.numAssessments,
          categoryStats: action.categoryStats,
          detailStats: action.detailStats,
          competenceStats: action.competenceStats,
          analytics: action.analytics
        }
      })

    default:
      return state
  }
}
