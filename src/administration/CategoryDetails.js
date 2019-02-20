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
import BarChart from '../BarChart' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'

function round(value) {
  return Math.round(value * 10) / 10.0
}

class CategoryDetails extends Component {
  render() {
    let sum = 0, num = 0, singleValues = [], newData = []
    const data = this.props.categoryStats || []
    data.forEach(e => {
      sum += e.value * e.count
      num += e.count
      singleValues = singleValues.concat(Array(e.count).fill(e.value))
      newData[e.value] = e.count
    })
    newData = Array.apply(null, Array(newData.length)).map((v, k) => ({value: k, count: newData[k] || 0}))
    const avg = sum / num
    const mean = singleValues[Math.floor(singleValues.length / 2)]
    const stddev = Math.sqrt(singleValues.reduce((sum, e) => sum + Math.pow(e - avg, 2), 0) / (num - 1))
    return <div>
      {this.props.categoryStats && <BarChart category={this.props.selectedCategory} data={newData} avg={avg} mean={mean} stddev={stddev}/>}
      {num ? <div>
        <div>Mittelwert: {round(avg)}</div>
        <div>Median: {mean}</div>
        <div>Standardabweichung: {round(stddev)}</div>
      </div> : ''}
    </div>
  }
}

CategoryDetails.propTypes = {
  selectedCategory: PropTypes.number.isRequired,
  categoryStats: PropTypes.array
}

export default CategoryDetails
