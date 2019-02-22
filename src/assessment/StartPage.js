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
import tree from './bot.png'

class StartPage extends Component {
  render() {
    return (
      <div className="page">
        <h1>{this.props.greeting}</h1>
        <div className="App-intro">
          <img src={tree} alt="Logo" />

          {this.props.description.split('\n').map((p, i) => (<p key={i}>{p}</p>))}

          <p className="buttons">
            <button className="btn btn-primary" onClick={() => this.props.start()}>Start</button>
          </p>

          <p className="disclaimer">
            Die Erhebung erfolgt anonym, eine Zuordnung zu Personen kann nicht vorgenommen werden. Es werden keine
            Daten gespeichert, die Rückschlüsse auf den Befragten erlauben.
          </p>
        </div>
      </div>)
  }
}

export default StartPage
