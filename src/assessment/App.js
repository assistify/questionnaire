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
import './App.css'
import PropTypes from 'prop-types'
import StartPage from './StartPage' // eslint-disable-line no-unused-vars
import QuestionPage from './QuestionPage' // eslint-disable-line no-unused-vars
import ResultPage from './ResultPage' // eslint-disable-line no-unused-vars
import unifiedFetch from './unifiedFetch'

let debug = false

const myFetch = unifiedFetch(fetch)

function rand(from, to) {
  return Math.floor(Math.random() * (to - from)) + from
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionnaire: {title: '', greeting: '', description: ''},
      questions: [],
      totals: 0,
      totalsPossible: 0,
      currentQuestion: -1,
      assessmentId: null,
      error: ''
    }
    myFetch('/api/assessment/' + this.props.match.params.questionnaire)
      .then(data => data.error ? Promise.reject(data.error) : data)
      .then(data => this.setState({questionnaire: data.questionnaire, error: null}))
      .catch(error => this.setState({error: error.message || error}))
  }

  loadQuestions() {
    return this.state.questions.length
      ? Promise.resolve({
        questions: this.state.questions,
        totalsPossible: this.state.totalsPossible
      })
      : myFetch('/api/assessment/' + this.props.match.params.questionnaire, {method: 'POST'})
  }

  start() {
    this.loadQuestions()
      .then(data => {
        data.error = null
        data.totals = 0
        data.currentQuestion = debug ? 16 : 0
        data.questions = data.questions.map(q => {
          if (debug) {
            q.answer = {[rand(1, 5)]: rand(0, 10)}
            return q
          } else {
            return Object.assign(q, {answer: {}})
          }
        })
        this.setState(data)
      })
      .catch(error => this.setState({error: error.message}))
  }

  prevQuestion() {
    let index = this.state.currentQuestion
    if (index > 0) {
      this.setState({currentQuestion: index - 1})
    }
  }

  nextQuestion() {
    const question = this.state.questions[this.state.currentQuestion]
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        assessmentId: this.state.assessmentId,
        questionId: question.id,
        answers: question.answer
      })
    }
    myFetch('/api/assessment/' + this.props.match.params.questionnaire + '/' + this.state.assessmentId + '/answer', options)
      .then(result => {
        if (result.ok) {
          this.setState({
            currentQuestion: this.state.currentQuestion + 1
          })
        } else {
          alert(result.statusText)
        }
      })
      .catch(error => this.setState({error}))
  }

  doAnswer(answer, value) {
    let questions = this.state.questions
    questions[this.state.currentQuestion].answer = answer
    this.setState({questions, totals: this.state.totals + value})
  }

  render() {
    let page
    if (this.state.currentQuestion === -1) {
      page = <StartPage start={() => this.start()}
        greeting={this.state.questionnaire.greeting}
        description={this.state.questionnaire.description}
      />
    } else if (this.state.currentQuestion >= this.state.questions.length) {
      page = <div className="thank-you">
        <h2>Vielen Dank für dein Feedback!</h2>
        <p>Das hilft uns, das Tagebuch in Zukunft besser zu machen und damit eurem und anderen Teams besser bei der Arbeit zu unterstützen!</p>
      </div>
    } else {
      let question = this.state.questions[this.state.currentQuestion]
      page = <QuestionPage question={question}
        prevQuestion={() => this.prevQuestion()}
        nextQuestion={() => this.nextQuestion()}
        hasPrevButton={this.state.currentQuestion > 0}
        doAnswer={(answer, value) => this.doAnswer(answer, value)}
        progress={this.state.currentQuestion / this.state.questions.length}
      />
    }
    return <div className="App">
      <header className="App-header">
        <h1 className="App-title">{this.state.questionnaire.title}</h1>
      </header>

      {this.state.error && <div className="error">{this.state.error}</div>}
      {page}
    </div>
  }
}

App.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaire: PropTypes.string.isRequired
    })
  })
}

export default App
