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

module.exports = db => {
  async function getNumOfAssessments(qround) {
    const where = qround ? `WHERE s.qroundId = ${qround}` : ''
    const sql = `SELECT count(*) as num from Assessments s ${where}`
    const result = await db.sequelize.query(sql, {type: db.sequelize.QueryTypes.SELECT})
    return result[0].num
  }

  async function getCategoryStats(questionnaireId, qroundId, categoryId) {
    const innerWhere = qroundId ? `WHERE s.qroundId = ${qroundId}` : ''
    const outerWhere = categoryId ? `AND q.competenceId = ${categoryId}` : ''
    const sql = `SELECT value, count(*) as count from (
    SELECT assessmentId, sum(a.value) AS value
        FROM (
          SELECT assessmentId, questionId, value FROM Answers a
          WHERE a.id in (
            SELECT max(b.id) FROM Answers b
            LEFT JOIN Assessments s ON b.assessmentId = s.id
            ${innerWhere}
            GROUP BY assessmentId, answeroptionid
          )) a
        LEFT JOIN Questions q ON q.id = a.questionId
        LEFT JOIN Competences c ON q.competenceId = c.id
        WHERE c.inhibitUserAnalysis <> 1 ${outerWhere}
        GROUP BY a.assessmentId
    ) x
    GROUP BY value`
    return db.sequelize.query(sql, {type: db.sequelize.QueryTypes.SELECT})
  }

  async function getStats(questionnaireId, qroundId, categoryId) {
    const numAssessments = await getNumOfAssessments(qroundId)
    const competenceStats = await getCompetences(qroundId)
    const categoryStats = categoryId && await getCategoryStats(questionnaireId, qroundId, categoryId)

    const innerWhere = qroundId ? `WHERE s.qroundId = ${qroundId}` : ''
    const outerWhere = categoryId ? `WHERE q.competenceId = ${categoryId}` : ''
    const sql = `
    SELECT q.id, q.title, q.type, o.id, o.text, a.value, count(*) as num
      FROM (
        SELECT assessmentId, questionId, answeroptionId, value FROM Answers a
        WHERE a.id in (
          SELECT max(b.id) FROM Answers b
          LEFT JOIN Assessments s ON b.assessmentId = s.id
          ${innerWhere}
          GROUP BY assessmentId, answeroptionId
        )) a
      LEFT JOIN Questions q ON q.id = a.questionId
      LEFT JOIN AnswerOptions o ON o.id = a.answerOptionId
      ${outerWhere}
      GROUP BY q.id, q.title, q.type, o.id, o.text, a.value`
    const detailStats = categoryId && await db.sequelize.query(sql, {type: db.sequelize.QueryTypes.SELECT})

    const analytics = await db.sequelize.query(`SELECT date(createdAt) AS date, count(*) AS num
      FROM Assessments s
      ${innerWhere}
      GROUP BY date
      ORDER BY date`,
      { type: db.sequelize.QueryTypes.SELECT }
    )

    return {
      numAssessments,
      competenceStats,
      categoryStats,
      detailStats,
      analytics
    }
  }

  async function getCompetences(qround) {
    const where = qround ? `WHERE s.qroundId = ${qround}` : ''
    const sql = `SELECT i.id, i.axis, avg(i.value) AS value
      FROM (
        SELECT c.id, c.name AS axis, sum(a.value) AS value
        FROM (
          SELECT assessmentId, questionId, value FROM Answers a
          WHERE a.id in (
            SELECT max(b.id) FROM Answers b
            LEFT JOIN Assessments s ON b.assessmentId = s.id
            ${where}
            GROUP BY assessmentId, answeroptionid
          )) a
        LEFT JOIN Questions q ON q.id = a.questionId
        LEFT JOIN Competences c ON q.competenceId = c.id
        WHERE c.inhibitUserAnalysis <> 1
        GROUP BY c.id, c.name, a.assessmentId
      ) AS i
      GROUP by i.id, i.axis`
    const results = await db.sequelize.query(sql, {type: db.sequelize.QueryTypes.SELECT})

    const sql2 = `SELECT i.id, sum(i.value) AS value
      FROM (SELECT q.type, c.id,
        CASE
          WHEN q.type = 'radio' THEN max(o.value)
          WHEN q.type = 'check' THEN sum(o.value)
          WHEN q.type = 'agreement' THEN 10 * count(o.id)
        END AS value
        FROM Questions q
        LEFT JOIN Competences c ON q.competenceId = c.id
        LEFT JOIN AnswerOptions o ON o.questionId = q.id
        WHERE c.inhibitUserAnalysis <> 1
        GROUP BY q.id, q.type
      ) AS i
      GROUP BY i.id`
    const competences = await db.sequelize.query(sql2, {type: db.sequelize.QueryTypes.SELECT})
    const totals = {}
    competences.forEach(c => totals[c.id] = c.value)

    return results.map(row => {
      row.value = row.value / totals[row.id]
      return row
    })
  }

  return {
    getNumOfAssessments,
    getStats,

    getQRoundResult: async qround => {
      return {
        numAssessments: await getNumOfAssessments(qround),
        competences: await getCompetences(qround)
      }
    }
  }
}
