/*
Copyright 2019 DB Systel GmbH, Frankfurt, Germany

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

class FreeTextField extends Component {
  render() {
    return (
      <textarea value={this.props.answer.textValue} onChange={e => {
        const answer = this.props.answer
        answer.textValue = e.target.value
        this.props.doAnswer(answer, 0)
      }} />
    )
  }
}

export default FreeTextField
