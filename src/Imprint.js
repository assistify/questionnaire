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

import React, {Component} from 'react'

class Imprint extends Component {
  render() {
    return <div>
      <header className="App-header">
        <h1 className="App-title">Impressum und Datenschutz</h1>
      </header>

      <div className="container">
        <a className="btn btn-default" href="/">&lt; zurück</a>
      </div>

      <div className="container">
        <p>Angaben gemäß § 5 TMG:</p>
        <p>--- Add your company information here ---</p>

        <h2>Haftungsausschluss</h2>
        <h3>Haftung für Inhalte</h3>
        <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
          Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß
          § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8
          bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
          bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
          konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
          Inhalte umgehend entfernen.</p>
        <h3>Urheberrecht</h3>
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
          Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
          des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und
          Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
          dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
          werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
          aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden
          wir derartige Inhalte umgehend entfernen.</p>

        <h2>Datenschutz</h2>
        <p>Es werden keine personenbezogenen Daten auf dieser Seite gespeichert. Die Antworten, die in den Befragungen
          gegeben werden, werden ohne Bezug auf tatsächliche Benutzer gespeichert.</p>
        <p>Es werden keine Tracker, weder eigene, noch fremde (z.B. Google) eingesetzt.</p>
        <p>Aus diesen Gründen können wir auch keine Auskünfte über die zu einzelnen Nutzern gespeicherten Daten geben -
          es gibt keine.</p>

        <p>Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung
          von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich
          widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der
          unverlangten Zusendung von Werbeinformationen,etwa durch Spam-Mails, vor.</p>
      </div>
    </div>
  }
}

export default Imprint
