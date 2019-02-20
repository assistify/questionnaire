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
const base58 = require('./base58')

describe('base58', () => {
  it('encode correctly', () => {
    base58.encode(4711).should.equal('3ot')
  })

  it('decode correctly', () => {
    base58.decode('3ot').should.equal(4711)
  })

  it('should be bijective', () => {
    base58.decode(base58.encode(4711)).should.equal(4711)
  })
})
