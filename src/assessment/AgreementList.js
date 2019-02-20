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

import React, { Component } from 'react'

class AgreementList extends Component {
  doChange(id, value) {
    let answer = this.props.answer
    let oldValue = Object.values(answer).reduce((a, b) => a + b, 0)
    answer['' + id] = value
    let newValue = Object.values(answer).reduce((a, b) => a + b, 0)
    this.props.doAnswer(answer, newValue - oldValue)
  }

  render() {
    const options = this.props.options.map(option => {
      return (
        <tr key={option.id}>
          <th>{option.text}</th>
          <td>
            <div className="radio-inline">
              <input type="radio" name={'opt-' + option.id} onClick={() => this.doChange(option.id, 1)} />
            </div>
          </td>
          <td>
            <div className="radio-inline">
              <input type="radio" name={'opt-' + option.id} onClick={() => this.doChange(option.id, 3)} />
            </div>
          </td>
          <td>
            <div className="radio-inline">
              <input type="radio" name={'opt-' + option.id} onClick={() => this.doChange(option.id, 5)} />
            </div>
          </td>
          <td>
            <div className="radio-inline">
              <input type="radio" name={'opt-' + option.id} onClick={() => this.doChange(option.id, 8)} />
            </div>
          </td>
          <td>
            <div className="radio-inline">
              <input type="radio" name={'opt-' + option.id} onClick={() => this.doChange(option.id, 10)} />
            </div>
          </td>
        </tr>
      )
    })

    return (<div>
      <p>Kreuzen Sie für jede Aussage die am besten passende Option an</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th />
            <th>stimme gar nicht zu</th>
            <th>stimme eher nicht zu</th>
            <th>teils/teils</th>
            <th>stimme eher zu</th>
            <th>stimme voll und ganz zu</th>
          </tr>
        </thead>
        <tbody>
          {options}
        </tbody>
      </table>
    </div>)
  }
}

export default AgreementList
