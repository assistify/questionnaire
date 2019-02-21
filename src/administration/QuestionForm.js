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
import AnswerOptionForm from './AnswerOptionForm' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'

const questionTypes = [
  { id: 'radio', name: 'Einfachauswahl' },
  { id: 'check', name: 'Mehrfachauswahl' },
  { id: 'agreement', name: 'Beurteilungsfrage' },
]

const competences = [
  { id: 1, name: 'Wertversprechen'},
  { id: 2, name: 'Qualität und Service'},
  { id: 3, name: 'Haufigkeit der Nutzung'},
  { id: 4, name: 'Zufriedenheit'}
]

let sequence = 0

class QuestionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      question: props.question
    }
  }

  doUpdateOption(optionId, field) {
    this.setState(state => {
      state.question.options = state.question.options.map(option => {
        if (option.id === optionId) {
          option[field.name] = field.value
        }
        return option
      })
      return {question: state.question}
    })
  }

  doCreateOption() {
    this.setState(state => {
      state.question.options.push({id: --sequence, text: '', value: null})
      return {question: state.question}
    })
  }

  doDeleteOption(optionId) {
    this.setState(state => {
      state.question.options = state.question.options.filter(option => option.id !== optionId)
      return {question: state.question}
    })
  }

  doUpdateOwnProp(field, value) {
    this.setState(state => {
      state.question[field] = value
      return {question: state.question}
    })
  }

  render() {
    const typeSelection = questionTypes.map(type => (
      <option key={type.id} value={type.id}>{type.name}</option>
    ))
    const competenceSelection = competences.map(competence => (
      <option key={competence.id} value={competence.id}>{competence.name}</option>
    ))
    const answerOptionForm = (
      <AnswerOptionForm options={this.state.question.options}
        doUpdate={(optionId, field) => this.doUpdateOption(optionId, field)}
        doCreate={() => this.doCreateOption()}
        doDelete={optionId => this.doDeleteOption(optionId)}
      />)

    const buttons = (
      <div className="btn-toolbar">
        <button className="btn btn-primary save-button" onClick={() => this.props.doChange(this.state.question)}>
          <span className="glyphicon glyphicon-floppy-disk" />
          Speichern
        </button>
        <button className="btn btn-default close-button" onClick={this.props.doClose}>
          <span className="glyphicon glyphicon-remove" />
          Schließen
        </button>
        <button className="btn btn-danger delete-button" onClick={this.props.doDelete}>
          <span className="glyphicon glyphicon-trash" />
          Frage Löschen
        </button>
      </div>)

    return <div className="details">
      <div className="form-group">
        <textarea className="form-control" value={this.state.question.title}
          onChange={e => this.doUpdateOwnProp('title', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Fragentyp</label>
        <select className="form-control" value={this.state.question.type}
          onChange={e => this.doUpdateOwnProp('type', e.target.value)} >
          {typeSelection}
        </select>
      </div>
      <div className="form-group">
        <label>Kategorie</label>
        <select className="form-control" value={this.state.question.competence ? this.state.question.competence.id : undefined}
          onChange={e => this.doUpdateOwnProp('competenceId', e.target.value)} >
          {competenceSelection}
        </select>
      </div>

      {answerOptionForm}
      {buttons}
    </div>
  }
}

QuestionForm.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    type: PropTypes.oneOf(['check', 'radio', 'agreement'])
  })
}

export default QuestionForm
