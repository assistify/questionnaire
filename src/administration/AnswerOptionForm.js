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

import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import './AnswerOptionForm.css'

class AnswerOptionForm extends Component {
  render() {
    const options = this.props.options && this.props.options.map(option => (
      <tr key={option.id}>
        <td>
          <button className="btn btn-delete" onClick={() => this.props.doDelete(option.id)}>
            <span className="glyphicon glyphicon-trash" />
          </button>
        </td>
        <td>
          <textarea name="text" value={option.text || ''}
            onChange={e => this.props.doUpdate(option.id, e.target)} />
        </td>
        <td>
          <input type="text" name="value" value={option.value || 0} className="numeric"
            onChange={e => this.props.doUpdate(option.id, e.target)} />
        </td>
      </tr>
    ))
    const newEntry = <td colSpan={3}>
      <button className="btn btn-new" onClick={() => this.props.doCreate()}>
        <span className="glyphicon glyphicon-plus" />
      </button>
    </td>

    return <table className="table table-striped">
      <thead><tr><th /><th>Text</th><th>Wert</th></tr></thead>
      <tbody>
        {options}
        <tr>
          {newEntry}
        </tr>
      </tbody>
    </table>
  }
}

export default AnswerOptionForm
