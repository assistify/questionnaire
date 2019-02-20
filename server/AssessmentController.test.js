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

const db = {}
const controller = require('./AssessmentController')(db)

describe('AssessmentController', () => {
  it('should order questions with a sort value of 2 after such with 1', () => {
    Math.random = () => 0.55
    controller.compareQuestions({competence: {sort: 2}}, {competence: {sort: 1}}).should.equal(1)
  })

  it('should order questions with a sort value of 1 before such with 2', () => {
    Math.random = () => 0.55
    controller.compareQuestions({competence: {sort: 1}}, {competence: {sort: 2}}).should.equal(-1)
  })

  it('should order questions with a sort value of 1 before such without a sort value', () => {
    Math.random = () => 0.55
    controller.compareQuestions({competence: {sort: 1}}, {competence: {}}).should.equal(-1)
  })

  it('should order questions with a sort value of 2 after such without a sort value', () => {
    Math.random = () => 0.55
    controller.compareQuestions({competence: {sort: 2}}, {competence: {}}).should.equal(1)
  })

  it('should order questions randomly if sort value is equal', () => {
    let counter = 0
    Math.random = () => ++counter * 0.33
    controller.compareQuestions({competence: {sort: 1}}, {competence: {sort: 1}}).should.equal(-1)
    counter.should.equal(1)
  })

  it('should order questions randomly if both sort values are not set', () => {
    let counter = 0
    Math.random = () => 1 - ++counter * 0.33
    controller.compareQuestions({competence: {}}, {competence: {}}).should.equal(1)
    counter.should.equal(2)
  })
})
