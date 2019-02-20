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
import './QuestionReport.css'

function round(value) {
  return Math.round(value * 10) / 10.0
}

class QuestionReport extends Component {
  render() {
    const list = this.props.stats && this.props.stats.map((e, i) => {
      return <li key={i}>
        <span className="title">{e.title}</span>
        <span className="option">{e.text}</span>
        <span className="type">{e.type}</span>
        <span className="num">{e.value}</span>
        <span className="average">{round(e.num)}</span>
      </li>
    })
    return <ul className="QuestionReport">{list}</ul>
  }
}

QuestionReport.propTypes = {
  selectedCategory: PropTypes.number.isRequired,
  stats: PropTypes.array
}

export default QuestionReport
