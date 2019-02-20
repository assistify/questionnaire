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

import React, {Component, Fragment} from 'react' // eslint-disable-line no-unused-vars
import RadarChart from '../RadarChart'
import CategorySelection from './CategorySelection' // eslint-disable-line no-unused-vars
import CategoryDetails from './CategoryDetails' // eslint-disable-line no-unused-vars
import QuestionReport from './QuestionReport' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import "react-tabs/style/react-tabs.css"
import Analytics from './Analytics'

class ReportPage extends Component {
  render() {
    return !this.props.stats ? null : <Tabs>
      <TabList>
        <Tab>Ergebnisse</Tab>
        <Tab>Details</Tab>
        <Tab>Nutzung</Tab>
      </TabList>

      <TabPanel className="stats">
        <h2>{this.props.title}</h2>
        {this.props.stats.competenceStats && <RadarChart radius={200} data={this.props.stats.competenceStats}/>}
        {this.props.stats.numAssessments && <div>{this.props.stats.numAssessments} durchgeführte Befragungen</div>}
      </TabPanel>

      <TabPanel className="stats">
        {this.props.stats.competenceStats && <CategorySelection
          categories={this.props.stats.competenceStats}
          onChange={e => this.props.setCategory(e.target.value)}
          category={isNaN(+this.props.category) ? null : +this.props.category}
        />}
        <br/>
        {this.props.category > 0 && <Fragment>
          <CategoryDetails
            selectedCategory={+this.props.category}
            questionnaire={this.props.questionnaire}
            categoryStats={this.props.stats.categoryStats}
          />

          <h3>Auswertung nach Fragen</h3>
          <QuestionReport
            selectedCategory={+this.props.category}
            questionnaire={this.props.questionnaire}
            stats={this.props.stats.detailStats}
          />
        </Fragment>}
      </TabPanel>

      <TabPanel className="stats Analytics">
        <h2>Nutzung</h2>
        <Analytics data={this.props.analytics} />
      </TabPanel>
    </Tabs>
  }
}

ReportPage.propTypes = {
  questionnaire: PropTypes.string.isRequired,
  stats: PropTypes.object,
  setCategory: PropTypes.func.isRequired,
  category: PropTypes.number,
  analytics: PropTypes.array
}

export default ReportPage
