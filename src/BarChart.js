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

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {scaleBand, scaleLinear} from 'd3-scale'
import {interpolateLab} from 'd3-interpolate'
import Axes from './Axes'

function getDigKompColor(index) {
  switch (+index) {
    case 1:
      return '#3697C4'
    case 2:
      return '#DF6421'
    case 3:
      return '#2FA17D'
    case 4:
      return '#D12548'
    case 5:
      return '#F2B130'
    default:
      console.log('cannot find color ' + index)
      return 'rgba(128, 0, 0, 0.3)'
  }
}

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.xScale = scaleBand()
    this.yScale = scaleLinear()
    this.xKey = this.props.xKey || 'value'
    this.yKey = this.props.yKey || 'count'
  }

  render() {
    const data = this.props.data
    const svgDimensions = {width: 800, height: 400}
    const maxLenXVal = Math.max(1, ...data.map(e => ('' + e[this.xKey]).length))
    const margins = {top: 20, right: 20, bottom: 10 * maxLenXVal, left: 20}
    const maxValue = Math.max(...data.map(d => d[this.yKey]))

    const xScale = this.xScale
      .padding(0.5)
      .domain(data.map(d => d[this.xKey]))
      .range([margins.left, svgDimensions.width - margins.right])

    const yScale = this.yScale
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top])

    const colorScale = scaleLinear()
      .domain([0, Math.max(...data.map(d => d[this.yKey]))])
      .range(['#F3E5F5', getDigKompColor(this.props.category)])
      .interpolate(interpolateLab)

    const bars = data.map(datum => <rect
        key={datum[this.xKey]}
        x={xScale(datum[this.xKey])}
        y={yScale(datum[this.yKey])}
        height={svgDimensions.height - margins.bottom - this.yScale(datum[this.yKey])}
        width={xScale.bandwidth()}
        fill={colorScale(datum[this.yKey])}
      />)

    const height = svgDimensions.height - margins.top - margins.bottom
    const step = xScale.step()
    return (<svg viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}>
      <g className="bars">{bars}</g>
      <Axes
        scales={{ xScale, yScale }}
        margins={margins}
        svgDimensions={svgDimensions}
      />
      <g className="stats">
        {this.props.avg && this.props.stddev && <rect x={margins.left + (this.props.avg - this.props.stddev + 0.5) * step}
              y={margins.top}
              width={2 * this.props.stddev * step}
              height={height}
              fill="rgba(64,64,64,0.2)"
        />}
        {this.props.avg && <line x1={margins.left + (this.props.avg + 0.5) * step}
              x2={margins.left + (this.props.avg + 0.5) * step}
              y1={margins.top}
              y2={margins.top + height}
              stroke="red" strokeWidth={2}
        />}
      </g>
    </svg>)
  }
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  category: PropTypes.number.isRequired
}

export default BarChart
