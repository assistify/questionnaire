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

const {encode} = require('./base58')
const handleErrors = require('./handleErrors')

module.exports = (db, reportingController) => {
  function formatQRound(qround) {
    return {id: qround.id, name: qround.name, uri: encode(qround.id), started: qround.createdAt}
  }

  async function getQuestionnaireId(name) {
    const questionnaires = await db.Questionnaire.findAll({where: {name}})
    if (questionnaires.length !== 1) {
      throw 'Questionnaire not found'
    }
    return questionnaires[0].id
  }

  async function listQuestionRounds(req, res) {
    try {
      const questionnaireId = await getQuestionnaireId(req.params.questionnaire)
      const [qrounds, competences, numAssessments] = await Promise.all([
        db.QRound.findAll({where: {questionnaireId: questionnaireId}}).then(result => result.map(formatQRound)),
        reportingController.getQRoundResult(),
        reportingController.getNumOfAssessments()
      ])
      res.json({qrounds, stats: {competences, numAssessments}})
    } catch (error) {
      handleErrors(res)(error)
    }
  }

  async function getStats(req, res) {
    try {
      const questionnaireId = await getQuestionnaireId(req.params.questionnaire)
      const stats = await reportingController.getStats(questionnaireId, +req.params.qround, +req.params.categoryId)
      res.json({stats})
    } catch (error) {
      handleErrors(res)(error)
    }
  }

  async function startQuestionRound(req, res) {
    try {
      const questionnaireId = await getQuestionnaireId(req.params.questionnaire)
      db.QRound.create({questionnaireId}, {attributes: ['questionnaireId']})
        .then(formatQRound)
        .then(result => res.json({result}))
        .catch(handleErrors(res))
    } catch (error) {
      handleErrors(res)(error)
    }
  }

  async function updateQuestionRound(req, res) {
    try {
      const questionnaireId = await getQuestionnaireId(req.params.questionnaire)
      const transaction = await db.sequelize.transaction()
      const qround = await db.QRound.findById(+req.params.qround, {transaction})
      const result = await qround.update(req.body, {attributes: ['name'], transaction})
      await transaction.commit()
      res.json(formatQRound(result))
    } catch (error) {
      handleErrors(res)(error)
    }
  }

  return {listQuestionRounds, startQuestionRound, getStats, updateQuestionRound}
}
