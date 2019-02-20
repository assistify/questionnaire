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

import React, {Component} from 'react'
import './ResultPage.css'
import RadarChart from '../RadarChart'

if (!Math.sign) {
  Math.sign = x => ((x > 0) - (x < 0)) || +x
}

if (!Object.values) {
  const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
  const concat = Function.bind.call(Function.call, Array.prototype.concat)
  const keys = subject => Object.getOwnPropertyNames(subject)

  Object.values = O => reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
}

class ResultPage extends Component {
  render() {
    function getAnswer(question) {
      return {
        competenceId: question.competence.id,
        competenceName: question.competence.name,
        points: Object.values(question.answer).reduce((a, b) => a + b, 0),
        includeInAnalysis: question.competence.includeInAnalysis
      }
    }

    function getCompetenceDetails(answers, totalsPossible) {
      const details = {}
      answers.forEach(info => {
        if (!details[info.competenceId]) {
          details[info.competenceId] = {competence: info.competenceName, points: 0}
        }
        details[info.competenceId].points += info.points
      })
      return Object.keys(details).map(id => ({
        id,
        axis: details[id].competence,
        value: details[id].points / totalsPossible[id]
      })).sort((a, b) => Math.sign(a.value - b.value))
    }

    const answers = this.props.questions.map(getAnswer).filter(answer => answer.includeInAnalysis)
    const data = getCompetenceDetails(answers, this.props.totalsPossible)

    return (
      <div className="page results">
        <h2>Ihr Ergebnis</h2>

        <p className="header">
          Sie haben <span id="totals">{this.props.totals}</span>
          von möglichen {Object.values(this.props.totalsPossible).reduce((a, b) => a + b, 0)} Punkten erhalten.
        </p>

        <div id="chart">
          <RadarChart radius={200} data={data} />
        </div>

        <button className="btn btn-primary" onClick={this.props.start}>Noch mal</button>
      </div>
    )
  }
}

export default ResultPage
