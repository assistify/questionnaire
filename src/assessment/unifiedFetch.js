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

module.exports = fetch => (url, options) => {
  const content = result => (result.headers.get('content-type') || '').match(/json/) ? result.json() : result.text()
  const httpError = result => result.status + ' ' + result.statusText
  const error = (info, result) => Promise.reject(info.error ? info.error : httpError(result))

  return fetch(url, options)
    .then(result => content(result).then(info => result.ok ? info : error(info, result)))
}
