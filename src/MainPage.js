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

class MainPage extends Component {
  render() {
    return <div>
      <header className="App-header">
        <h1 className="App-title">Assistify Befragungen</h1>
      </header>

      <div className="container MainPage">
        <div className="App-intro">
          <p>
             Wenn du hierher kommst, wolltest du wahrscheinlich an einer unserer Befragungen teilnehmen.
          </p>

          <p>
            Leider scheint der Link, den du bekommen hast, unvollständig zu sein. Bitte prüfe ihn noch einmal
            oder frage bei demjenigen nach, von dem du ihn hast.
          </p>

          <p>
            <a href="/imprint">Impressum und Datenschutz</a>
          </p>
        </div>
      </div>
    </div>
  }
}

export default MainPage
