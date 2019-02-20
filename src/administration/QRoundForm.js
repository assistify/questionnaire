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
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react' // eslint-disable-line no-unused-vars
import ReportPage from './ReportPage'
import {loadQRoundStats} from '../actions/statActions'
import {updateQRound} from '../actions/qroundActions'
import './QRoundForm.css'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class QRoundForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      error: ''
    }
    this.props.loadQRoundStats(this.props.questionnaire, this.props.qround.id)
  }

  componentDidUpdate(prevProps) {
    if (this.props.qround.id !== prevProps.qround.id) {
      this.props.loadQRoundStats(this.props.questionnaire, this.props.qround.id, this.state.category)
    }
  }

  setCategory(category) {
    this.setState({category})
    this.props.loadQRoundStats(this.props.questionnaire, this.props.qround.id, category)
  }

  handleChange(field, value) {
    this.props.updateQRound(this.props.questionnaire, Object.assign(this.props.qround, {[field]: value}))
  }

  render() {
    const url = window.location.origin + '/' + this.props.qround.uri
    const code = this.props.qround && <div className="QRCodeWrapper">
      <QRCode value={url} size={400} renderAs={'svg'} />
    </div>
    const startDate = new Date(this.props.qround.started).toLocaleString()

    return <div className="details" key={this.props.qround.id}>
      <div className="form-group">
        <label>Name der Befragung</label>
        <input className="form-control"
               defaultValue={this.props.qround.name || ''}
               onChange={e => this.handleChange('name', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>URL der Befragung</label>
        <input disabled className="form-control" value={url} />
      </div>

      <div className="form-group">
        <label>Start der Befragung</label>
        <input disabled className="form-control" value={startDate} />
      </div>

      {code}
      <div className="qround-url printOnly">{url}</div>

      <ReportPage title={`Auswertung der Runde '${this.props.qround.name || startDate}'`}
                  questionnaire={this.props.questionnaire}
                  stats={this.props.stats}
                  category={+this.state.category}
                  setCategory={category => this.setCategory(category)}
                  analytics={this.props.stats && this.props.stats.analytics}
      />

      <div className="btn-toolbar">
        <button className="btn btn-default close-button" onClick={this.props.doClose}>
          <span className="glyphicon glyphicon-remove" />
          Schließen
        </button>
      </div>
    </div>
  }
}

QRoundForm.propTypes = {
  questionnaire: PropTypes.string.isRequired,
  qround: PropTypes.shape({
    id: PropTypes.number,
    started: PropTypes.string
  })
}

function mapStateToProps(state) {
  return {
    stats: state.stats.qround
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({loadQRoundStats, updateQRound}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(QRoundForm)
