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

import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import configureStore from './configureStore'
import {Provider} from 'react-redux'
import './index.css'
import App from './assessment/App'
import MainPage from './MainPage'
import Imprint from './Imprint'
import LoginPage from './LoginPage'
import AdminPage from './administration/AdminPage'
import registerServiceWorker from './registerServiceWorker'
import {ProtectedRoute} from './ProtectedRoute'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch className="App">
        <Route exact path="/" component={MainPage}/>
        <Route path="/imprint" component={Imprint}/>
        <Route path="/login" component={LoginPage}/>
        <ProtectedRoute path="/admin/:questionnaire" component={AdminPage}/>
        <Route path="/:questionnaire" component={App}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
