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

const {decode} = require('./base58')
const handleErrors = require('./handleErrors')
const sortVal = val => val ? val - 1 : Math.random()

module.exports = db => {
  function findQuestionnaire(qround) {
    return db.QRound.findById(decode(qround))
      .then(qround => qround || Promise.reject({code: 404, message: 'Assessment not found'}))
      .then(qround => qround.questionnaireId)
  }

  function mapQuestion(question) {
    const competenceMapper = competence => ({
      id: competence.id,
      name: competence.name,
      includeInAnalysis: !competence.inhibitUserAnalysis,
      sort: competence.sort
    })

    return {
      id: question.id,
      title: question.title,
      type: question.type,
      competence: question.competence ? competenceMapper(question.competence) : null,
      options: question.options.map(option => ({
        id: option.id,
        text: option.text,
        value: option.value
      }))
    }
  }

  function compareQuestions(a, b) {
    return Math.sign(sortVal(a.competence.sort) - sortVal(b.competence.sort)) || Math.sign(Math.random() - 0.5)
  }

  return {
    compareQuestions,

    getAssessmentInfo: (req, res) => {
      findQuestionnaire(req.params.qround)
        .then(questionnaireId => db.Questionnaire.findOne({
          attributes: ['id', 'title', 'greeting', 'description'],
          where: {id: questionnaireId}
        }))
        .then(questionnaire => res.json({questionnaire}))
        .catch(handleErrors(res))
    },

    createAssessment: (req, res) => {
      const totalsReducer = {
        check: (accumulator, option) => accumulator + option.value,
        radio: (accumulator, option) => Math.max(accumulator, option.value),
        agreement: accumulator => accumulator + 10
      }
      const questionReducer = (accumulator, question) => {
        if (question.competence) {
          if (!accumulator[question.competence.id]) {
            accumulator[question.competence.id] = 0
          }
          accumulator[question.competence.id] += question.options.reduce(totalsReducer[question.type], 0)
        }
        return accumulator
      }
      let result = {}
      let questionnaire

      findQuestionnaire(req.params.qround)
        .then(questionnaireId => questionnaire = questionnaireId)
        .then(() => db.Assessment.create({QroundId: decode(req.params.qround)}))
        .then(assessment => result.assessmentId = assessment.id)
        .then(() => db.Question.findAll({
          where: {active: true},
          attributes: ['id', 'title', 'type'],
          include: [
            'competence',
            'options',
            {model: db.Questionnaire, as: 'questionnaire', attributes: [], where: {id: questionnaire}}
          ]
        }))
        .then(questions => {
          result.totalsPossible = questions.reduce(questionReducer, {})
          result.questions = questions.map(mapQuestion).sort(compareQuestions)
          res.json(result)
        })
        .catch(handleErrors(res))
    },

    giveAnswer: async (req, res) => {
      try {
        await db.Answer.destroy({where: {assessmentId: +req.params.id, questionId: +req.body.questionId}})
        await db.Answer.bulkCreate(Object.keys(req.body.answers).map(optionId => ({
          assessmentId: +req.params.id,
          questionId: +req.body.questionId,
          answerOptionId: +optionId,
          value: req.body.answers[optionId]
        })))
        res.json({ok: true})
      } catch (error) {
        console.error(error)
        res.status(error.code || 200).json({error: error.message || error})
      }
    }
  }
}
