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

module.exports = db => {
  function handleError(error, res) {
    console.error(error)
    res.json({error})
  }

  function getOptions(questionnaire, where) {
    return {
      attributes: ['id', 'title', 'type', 'questionnaireId', 'active'],
      include: [
        {model: db.Competence, as: 'competence', attributes: ['id', 'name']},
        {model: db.AnswerOption, as: 'options', attributes: ['id', 'text', 'value']},
        {model: db.Questionnaire, as: 'questionnaire', attributes: [], where: {name: questionnaire}}
      ],
      where
    }
  }

  return {
    listQuestions: (req, res) => {
      db.Question.findAll(getOptions(req.params.questionnaire))
        .then(questions => res.json(questions))
        .catch(error => handleError(error, res))
    },

    getQuestion: (req, res) => {
      db.Question.findAll(getOptions(req.params.questionnaire, { id: +req.params.id }))
        .then(result => result.length ? result[0] : Promise.reject('Question not found'))
        .then(question => res.json(question))
        .catch(error => handleError(error, res))
    },

    createQuestion: (req, res) => {
      db.Questionnaire.findAll({name: req.params.questionnaire})
        .then(result => result.length ? result[0].id : Promise.reject('Questionnaire not found'))
        .then(questionnaire => req.body.questionnaireId = questionnaire)
        .then(() => db.Question.create(req.body, {attributes: ['title', 'type', 'competenceId', 'questionnaireId']}))
        .then(question => res.json(question))
        .catch(error => handleError(error, res))
    },

    updateQuestion: (req, res) => {
      const questionId = +req.params.id
      let newOptions = req.body.options
      let currentOptions
      let question

      return db.sequelize.transaction()
        .then(transaction => {
          function createOption(option) {
            option.QuestionId = questionId
            option.id = null
            return db.AnswerOption.create(option, {transaction})
          }

          function handleExisting(option) {
            const index = newOptions.findIndex(no => no.id === option.id)
            if (index < 0) {
              return option.destroy({transaction})
            } else {
              const newOption = newOptions.splice(index, 1)[0]
              if (option.id > 0) {
                return option.update(newOption, {transaction})
              } else {
                return createOption(newOption)
              }
            }
          }

          return db.Question.findById(questionId, {transaction, include: ['options']})
            .then(question => {
              currentOptions = question.options
              return question.update(req.body, { attributes: ['title', 'type', 'competenceId'], transaction })
            })
            .then(() => Promise.all(currentOptions.map(handleExisting)))
            .then(() => Promise.all(newOptions.map(createOption)))
            .then(() => db.Question.findById(questionId, {transaction, include: ['options']}))
            .then(result => question = result)
            .then(() => transaction.commit())
            .then(() => res.json(question))
        })
        .catch(error => handleError(error, res))
    },

    deleteQuestion: (req, res) => {
      db.Question.findAll(getOptions(req.params.questionnaire, { id: +req.params.id }))
        .then(questions => questions.length ? questions[0] : Promise.reject('Question not found'))
        .then(question => question.destroy())
        .then(question => res.json(question))
        .catch(error => handleError(error, res))
    }
  }
}
