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

require('should')
const db = require('./models')('mysql://root:root@localhost/questionnaire_test', false)
const controller = require('./QuestionController')(db)

describe('QuestionController', () => {
  beforeEach(() => db.sequelize.transaction()
    .then(transaction => {
      return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {transaction})
        .then(() => db.AnswerOption.destroy({where: {}, transaction}))
        .then(() => db.Question.destroy({where: {}, transaction}))
        .then(() => db.Questionnaire.destroy({where: {}, transaction}))
        .then(() => db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {transaction}))
        .then(() => transaction.commit())
        .catch(error => console.error(error))
    })
  )

  after(() => db.sequelize.close())

  it('should update options', () => db.sequelize.transaction()
    .then(transaction => {
      let question
      const options = [
        {text: 'Das ist die ursprüngliche Version', value: 42},
        {text: 'Dieser Eintrag wird gelöscht', value: 815}
      ]
      const params = {include: 'options', transaction}
      return db.Questionnaire.create({name: 'TEST'})
        .then(questionnaire => db.Question.create({questionnaireId: questionnaire.id, options}, params))
        .then(result => question = result)
        .then(() => transaction.commit())
        .then(() => question)
    })
    .then(question => controller.updateQuestion({
        params: {id: question.id},
        body: {
          options: [
            {id: question.options[0].id, text: 'Das ist die geänderte Version', value: 1},
            {text: 'Das ist neu', value: 99}
          ]
        }
      }, {json: result => result.toJSON()})
    )
    .then(result => {
      result.should.not.have.property('error')
      result.should.have.property('options')
      result.options.length.should.equal(2)
      result.options[0].text.should.equal('Das ist die geänderte Version')
      result.options[1].text.should.equal('Das ist neu')
    })
  )

  it('should give positive ids for new options', () => db.sequelize.transaction()
    .then(transaction => {
      let question
      const options = []
      const params = {include: 'options', transaction}
      return db.Questionnaire.create({name: 'TEST'})
        .then(questionnaire => db.Question.create({questionnaireId: questionnaire.id, options}, params))
        .then(result => question = result)
        .then(() => transaction.commit())
        .then(() => question)
    })
    .then(question => controller.updateQuestion({
        params: {id: question.id},
        body: {options: [{id: -1, text: 'Das ist neu', value: 99}]}
      }, {json: result => result.toJSON()})
    )
    .then(result => {
      result.should.not.have.property('error')
      result.options[0].id.should.be.greaterThan(0)
    })
  )
})
