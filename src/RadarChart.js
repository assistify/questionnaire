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

function getDigKompColor(index) {
  switch (+index) {
    case 1: return '#3697C4'
    case 2: return '#DF6421'
    case 3: return '#2FA17D'
    case 4: return '#D12548'
    case 5: return '#F2B130'
    default:
      console.log('cannot find color ' + index)
      return 'rgba(128, 0, 0, 0.3)'
  }
}

const d3 = require('d3')
const color = getDigKompColor  // d3.scaleOrdinal(d3.schemeCategory10)

class RadarChart extends Component {
  render() {
    const data = this.props.data || []
    const radius = this.props.radius
    const segSize = Math.PI * 2 / (data.length || 1)
    const translation = 'translate(' + radius + ',' + radius + ')'
    const paths = data.map(getPath)
    const labels = data.map(getLabel)
    const lines = data.map(getLine)

    function getPath(entry, index) {
      const arc = d3.arc()
        .outerRadius((radius - 5) * (0.8 * entry.value + 0.2))
        .innerRadius((radius - 5) * 0.2)
        .cornerRadius(3).padAngle(0.02)
        .startAngle(index * segSize).endAngle((index + 1) * segSize)
      return <path key={index} d={arc()} fill={color(entry.id || entry.axis)} stroke="#eee"/>
    }

    function getLabel(entry, index) {
      const texts = entry.axis.split(' ')
      texts.push(Math.round(entry.value * 100) + '%')
      const alpha = segSize * index - Math.PI / 2 + segSize / 2
      const pos = [
        Math.cos(alpha) * (radius - 5) * 0.6,
        Math.sin(alpha) * (radius - 5) * 0.6 - (texts.length - 1) / 2 * 13
      ]
      return <text key={index} transform={'translate(' + pos + ')'} textAnchor="middle">
        {texts.map((t, j) => <tspan key={j} x="0" dy={j ? '1.35em' : '0'}>{t}</tspan>)}
      </text>
    }

    function getLine(entry, index) {
      const alpha = segSize * index - Math.PI / 2
      return <line key={index} stroke="#737373" strokeWidth={0.5}
                   x1={Math.cos(alpha) * (radius - 5)}
                   y1={Math.sin(alpha) * (radius - 5)}
                   x2={Math.cos(alpha) * (radius * 0.2)}
                   y2={Math.sin(alpha) * (radius * 0.2)}
      />
    }

    return (<svg viewBox={'0 0 ' + (radius * 2) + ' ' + (radius * 2)} width={radius * 2} height={radius * 2}>
      <g transform={translation}>
        <g className="chart-background">
          <circle r={radius - 5} stroke="#CDCDCD" fill="#f7f7f7"/>
          <circle r={radius * 0.6 - 1} stroke="#CDCDCD" fill="#efefef"/>
          <circle r={radius * 0.2 - 1} stroke="#CDCDCD" fill="#ffffff"/>
          <text x={1} y={-radius + 10} fill="#737373" textAnchor="left">100%</text>
          <text x={1} y={-radius * 0.6 + 5} fill="#737373" textAnchor="left">50%</text>
          {lines}
        </g>
        <g className="paths">{paths}</g>
        <g className="labels">{labels}</g>
      </g>
    </svg>)
  }
}

export default RadarChart
