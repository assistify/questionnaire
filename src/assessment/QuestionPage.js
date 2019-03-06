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
import CheckboxList from './CheckboxList'
import RadioButtonList from './RadioButtonList'
import AgreementList from './AgreementList'
import FreeTextField from './FreeTextField'

const components = {
  check: CheckboxList,
  radio: RadioButtonList,
  agreement: AgreementList,
  text: FreeTextField
}

class QuestionPage extends Component {
  render() {
    const Component = components[this.props.question.type] // eslint-disable-line no-unused-vars
    const width = (100 * this.props.progress) + '%'
    const prevButton = this.props.hasPrevButton &&
      <button className="btn btn-primary prev" onClick={this.props.prevQuestion}>Zurück</button>

    return (
      <div>
        <div className="progressBar"><div style={{width}} /></div>
        <div className="page">
          <h2>{this.props.question.title}</h2>
          <Component options={this.props.question.options}
            doAnswer={this.props.doAnswer}
            answer={this.props.question.answer}
            nextQuestion={this.props.nextQuestion}
          />
          <button className="btn btn-primary next" onClick={this.props.nextQuestion}>Weiter</button>
          {prevButton}
        </div>
      </div>
    )
  }
}

export default QuestionPage
