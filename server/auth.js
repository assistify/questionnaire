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

module.exports = (app, db, secret) => {
  const passport = require('passport')
  const bcrypt = require('bcryptjs')
  const LocalStrategy = require('passport-local').Strategy
  const jwt = require('jsonwebtoken')
  const JwtStrategy = require('passport-jwt').Strategy
  const ExtractJwt = require('passport-jwt').ExtractJwt

  function findUser(username) {
    console.log('find ' + username)
    return db.User.findAll({where: {username}})
      .then(result => result.length ? result[0] : Promise.reject('user not found'))
  }

  function tokenForUser(user) {
    return jwt.sign({sub: user.id}, secret, {expiresIn: '12h'})
  }

  function createNewUser(username, password) {
    return new Promise((fulfil, reject) => {
      bcrypt.hash(password, 10, (err, passwordHash) => {
        if (err) {
          reject(err)
        } else {
          fulfil(db.User.create({username: username, passwordHash}))
        }
      })
    })
  }

  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username)
        .then(user => bcrypt.compare(password, user.passwordHash, (err, isValid) => done(err, isValid ? user : false)))
        .catch(error => done(error, false))
    }
  ))

  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secret
  }, (payload, done) => {
    db.User.findById(payload.sub)
      .then(user => done(null, user || false))
      .catch(error => done(error, false))
  }))

  return {
    signin: (req, res) => res.send({token: tokenForUser(req.user)}),

    signup: (req, res) => {
      findUser(req.body.username)
        .then(() => res.status(422).json({error: 'Email is in use'}))
        .catch(() => createNewUser(req.body.username, req.body.password))
        .then(user => res.json({token: tokenForUser(user)}))
        .catch(error => res.json(error))
    }
  }
}
