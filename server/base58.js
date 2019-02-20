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

const alphabet = 'ztsx4Q6R2bZMr3awEBUcKHToAudpkqL7g1yVYfSiXmPFW5vC9jnDhGeNJ8'
const base = alphabet.length

module.exports = {
  encode: num => {
    let encoded = ''
    while (num) {
      const remainder = num % base
      num = Math.floor(num / base)
      encoded += alphabet[remainder]
    }
    return encoded
  },

  decode: str => {
    let decoded = 0
    while (str) {
      const index = alphabet.indexOf(str.substr(-1))
      decoded += index * (Math.pow(base, str.length - 1))
      str = str.substring(0, str.length - 1)
    }
    return decoded
  }
}
