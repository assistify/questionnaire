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

import React, {Component} from 'react' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {deleteQuestion, loadQuestions, updateQuestion, setActiveQuestion} from '../actions/questionActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class QuestionList extends Component {
  constructor(props) {
    super(props)
    this.props.loadQuestions(this.props.questionnaire)
  }

  setActiveQuestion(question) {
    this.props.setActiveQuestion(question)
    this.props.setDetailVisibility(true)
  }

  render() {
    const isSelected = question => question && this.props.questions.active && this.props.questions.active.id === question.id ? ' active' : ''
    const isCancelled = question => question.active ? '' : ' cancelled'
    const questions = this.props.questions !== null
      ? this.props.questions.list.map(question => {
        return (
          <li className={'list-group-item clickable' + isSelected(question) + isCancelled(question)} key={question.id}
            onClick={() => this.setActiveQuestion(question)}>
            {question.title}
          </li>
        )
      })
      : <li className="loading"/>

    return this.props.error
      ? <div className="error">{this.props.error}</div>
      : <ul className="panel-body list-group" id="questionList" key="questionList">
          {questions}
          <li className={'list-group-item clickable' + isSelected(null)}
            onClick={() => this.setActiveQuestion({id: null, title: '', type: 'check', options: []})}>
            <span className="glyphicon glyphicon-plus"/>&nbsp;
            Neue Frage anlegen
          </li>
        </ul>
  }
}

QuestionList.propTypes = {
  questionnaire: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    questions: state.questions,
    error: state.misc.error
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadQuestions, deleteQuestion, updateQuestion, setActiveQuestion}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
