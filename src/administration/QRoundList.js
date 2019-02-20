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
import {loadQRounds, createQRound} from '../actions/qroundActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import './QRoundList.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

class QuestionnaireList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: null,
      showDetails: false,
      error: ''
    }
    this.props.loadQRounds(this.props.questionnaire)
  }

  render() {
    const qrounds = this.props.qrounds !== null
      ? this.props.qrounds.map(qround => {
        const active = this.props.activeQRound && this.props.activeQRound.id === qround.id ? ' active' : ''
        return <li className={'list-group-item clickable' + active} key={qround.id}
          onClick={() => this.props.setActiveQRound(qround)}
        >{qround.name}<span className="started">{formatDate(qround.started)}</span></li>
      })
      : <li className="loading"/>

    return this.props.error
      ? <div className="error">{this.props.error}</div>
      : <ul className="panel-body list-group" id="QRoundList" key="QRoundList">
          {qrounds}
          <li className="list-group-item clickable" onClick={() => this.props.createQRound(this.props.questionnaire)}>
            <span className="glyphicon glyphicon-plus"/>&nbsp;
            Neue Befragung starten
          </li>
        </ul>
  }
}

QuestionnaireList.propTypes = {
  questionnaires: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      title: PropTypes.string,
      greeting: PropTypes.string,
      description: PropTypes.string
    })
  )
}

function mapStateToProps(state) {
  return {
    qrounds: state.qrounds.list,
    error: state.misc.error
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadQRounds, createQRound}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireList)
