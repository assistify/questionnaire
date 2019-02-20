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

'use strict'

const port = process.env.PORT || 8080
const AUTH_SECRET = process.env.AUTH_SECRET
const DB_URL = process.env.DB_URL

const logger = console

if (!AUTH_SECRET) {
  logger.error('Need a AUTH_SECRET environment variable')
}
if (!DB_URL) {
  logger.error('Need a DB_URL environment variable')
}

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const path = require('path')

const db = require('./models')(DB_URL)
const assessmentController = require('./AssessmentController')(db)
const questionController = require('./QuestionController')(db)
const reportingController = require('./ReportingController')(db)
const questionnaireController = require('./QuestionnaireController')(db, reportingController)

const auth = require('./auth')(app, db, AUTH_SECRET)
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignIn = passport.authenticate('local', {session: false})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  logger.info(req.method, req.path)
  next()
})

app.get('/api/assessment/:qround', assessmentController.getAssessmentInfo)
app.post('/api/assessment/:qround', assessmentController.createAssessment)
app.post('/api/assessment/:qround/:id/answer', assessmentController.giveAnswer)

app.post('/api/signup', auth.signup)
app.post('/api/signin', requireSignIn, auth.signin)

app.get('/api/:questionnaire/questions', requireAuth, questionController.listQuestions)
app.get('/api/:questionnaire/questions/:id', requireAuth, questionController.getQuestion)
app.post('/api/:questionnaire/questions', requireAuth, questionController.createQuestion)
app.put('/api/:questionnaire/questions/:id', requireAuth, questionController.updateQuestion)
app.delete('/api/:questionnaire/questions/:id', requireAuth, questionController.deleteQuestion)

app.get('/api/:questionnaire/stats', requireAuth, questionnaireController.getStats)
app.get('/api/:questionnaire/categories/:categoryId/stats', requireAuth, questionnaireController.getStats)
app.get('/api/:questionnaire/qround/:qround/stats', requireAuth, questionnaireController.getStats)
app.get('/api/:questionnaire/qround/:qround/categories/:categoryId/stats', requireAuth, questionnaireController.getStats)

app.put('/api/:questionnaire/qround/:qround', requireAuth, questionnaireController.updateQuestionRound)
app.get('/api/:questionnaire', requireAuth, questionnaireController.listQuestionRounds)
app.post('/api/:questionnaire', requireAuth, questionnaireController.startQuestionRound)

app.get('/api/:questionnaire/qround/:qround', requireAuth, (req, res) => {
  reportingController.getQRoundResult(req.params.qround)
    .then(result => res.json({result}))
    .catch(error => res.status(error.status || 500).json({error: error.message || error}))
})

app.use(express.static(path.join(__dirname, '/../build/')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/../build/index.html')))

app.use((req, res, next) => {
  res.status(404).json({error: 'Cannot ' + req.method + ' ' + req.path})
  next()
})

app.listen(port, () => {
  logger.info('Listening on port #' + port)
})
