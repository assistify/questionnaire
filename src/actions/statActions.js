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

export function loadGlobalStats(questionnaire, category = null) {
  return function (dispatch) {
    const categoryPath = category ? `/categories/${category}` : ''
    return fetchDataWithAuth('GET', `/${questionnaire}${categoryPath}/stats`)(dispatch)
      .then(result => dispatch({
        type: types.LOAD_GLOBAL_STATS_SUCCESS,
        numAssessments: result.stats.numAssessments,
        categoryStats: result.stats.categoryStats,
        detailStats: result.stats.detailStats,
        competenceStats: result.stats.competenceStats,
        analytics: result.stats.analytics
      }))
      .catch(error => dispatch({type: types.SHOW_ERROR, error}))
  }
}

export function loadQRoundStats(questionnaire, qround = null, category = null) {
  return function (dispatch) {
    const categoryPath = category ? `/categories/${category}` : ''
    return fetchDataWithAuth('GET', `/${questionnaire}/qround/${qround}${categoryPath}/stats`)(dispatch)
      .then(result => dispatch({
        type: types.LOAD_QROUND_STATS_SUCCESS,
        numAssessments: result.stats.numAssessments,
        categoryStats: result.stats.categoryStats,
        detailStats: result.stats.detailStats,
        competenceStats: result.stats.competenceStats,
        analytics: result.stats.analytics
      }))
      .catch(error => dispatch({type: types.SHOW_ERROR, error}))
  }
}
