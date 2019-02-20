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
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {deleteQuestion, updateQuestion, setActiveQuestion} from '../actions/questionActions'
import {loadQRounds, loadQRoundData} from '../actions/qroundActions'
import QRoundList from './QRoundList' // eslint-disable-line no-unused-vars
import QuestionList from './QuestionList' // eslint-disable-line no-unused-vars
import QRoundForm from './QRoundForm' // eslint-disable-line no-unused-vars
import QuestionForm from './QuestionForm' // eslint-disable-line no-unused-vars
import ReportPage from './ReportPage' // eslint-disable-line no-unused-vars
import {confirmAlert} from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import './AdminPage.css'
import {loadGlobalStats} from '../actions/statActions'

class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeQRound: null,
      activePanel: null,
      showDetails: false,
      category: null,
      error: ''
    }
    this.props.loadQRounds(this.props.match.params.questionnaire)
    this.props.loadGlobalStats(this.props.match.params.questionnaire)
  }

  doClose() {
    this.props.setActiveQuestion(null)
    this.setActivationState({}, 2)
  }

  doChange(question, change) {
    this.props.updateQuestion(this.props.match.params.questionnaire, question, change)
    this.setDetailVisibility(false)
  }

  doDelete(question) {
    confirmAlert({
      title: 'Löschen bestätigen',
      message: 'Soll die Frage wirklich gelöscht werden?',
      buttons: [{
        label: 'Ja, kann weg',
        onClick: () => {
          this.props.deleteQuestion(this.props.match.params.questionnaire, question)
          this.setDetailVisibility(false)
        }
      }, {
        label: 'OH NOOO!',
        onClick: () => {}
      }]
    })
  }

  setActivationState(newState, activePanel) {
    const showDetails = !!Object.values(newState)[0]
    this.setDetailVisibility(showDetails)
    newState.activePanel = activePanel
    window.setTimeout(() => this.setState(newState), showDetails ? 0 : 500)
  }

  setDetailVisibility(showDetails) {
    this.setState({showDetails})
  }

  setActiveQRound(activeQRound) {
    this.props.loadQRoundData(this.props.match.params.questionnaire, activeQRound.id)
    this.setActivationState({activeQRound}, 1)
  }

  setCategory(category) {
    this.setState({category})
    this.props.loadGlobalStats(this.props.match.params.questionnaire, category)
  }

  render() {
    let details
    if (this.state.activePanel === 1) {
      details = this.state.activeQRound && <QRoundForm
        key="qroundForm"
        questionnaire={this.props.match.params.questionnaire}
        qround={this.state.activeQRound}
        qroundData={this.props.qroundData}
        doClose={() => this.setActivationState({activeQRound: null}, 1)}
      />
    } else if (this.state.activePanel === 2) {
      details = this.props.questions && this.props.questions.active && <QuestionForm
        key="questionForm"
        question={this.props.questions.active}
        doChange={change => this.doChange(this.props.questions.active, change)}
        doClose={() => this.doClose()}
        doDelete={() => this.doDelete(this.props.questions.active)}
      />
    }

    const camelize = str => str[0].toUpperCase() + str.substring(1)
    return <div className="App Admin">
      <header className="App-header">
        <h1 className="App-title">Befragung "{camelize(this.props.match.params.questionnaire)}"</h1>
      </header>

      <div className={'slideWrapper' + (this.state.showDetails ? ' selected' : '')}>
        <div>
          <div className="panel panel-default">
            <div className="panel-heading" onClick={() => this.setActivationState({activeQRound: null}, 1)}>
              <h2 className="panel-title">Befragungsrunden</h2>
            </div>
            {this.state.activePanel === 1 &&
            <QRoundList questionnaire={this.props.match.params.questionnaire}
                        activeQRound={this.state.activeQRound}
                        setActiveQRound={activeQRound => this.setActiveQRound(activeQRound)}
            />}
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" onClick={() => this.setActivationState({}, 2)}>
              <h2 className="panel-title">Fragen bearbeiten</h2>
            </div>
            {this.state.activePanel === 2 &&
            <QuestionList questionnaire={this.props.match.params.questionnaire}
                          setDetailVisibility={show => this.setDetailVisibility(show)}/>
            }
          </div>

          <div className="panel panel-default">
            <ReportPage title="Gesamtauswertung"
                        questionnaire={this.props.match.params.questionnaire}
                        stats={this.props.stats}
                        category={+this.state.category}
                        setCategory={category => this.setCategory(category)}
                        analytics={this.props.stats && this.props.stats.analytics}
            />
          </div>
        </div>

        {details}

        {this.state.error && <div className="error">{this.state.error}</div>}
      </div>
    </div>
  }
}

AdminPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaire: PropTypes.string.isRequired
    })
  })
}

function mapStateToProps(state) {
  return {
    error: state.misc.error,
    questions: state.questions,
    qroundData: state.qrounds.data,
    stats: state.stats.global
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({deleteQuestion, updateQuestion, setActiveQuestion, loadQRounds, loadQRoundData, loadGlobalStats}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
