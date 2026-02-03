import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Link } from '@/components/ui/Link';
import { Paragraph, Title } from '@/components/ui/typography';

export default function LegalNotice() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <Title size='two' className='leading-none'>
          Impressum
        </Title>
        <Paragraph>
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV Kunsthochschule
          Kassel
        </Paragraph>
        <Paragraph>
          i. A. Joel Baumann und Laura Därr
          <br />
          Menzelstraße 13-15
          <br />
          34121 Kassel
        </Paragraph>
        <Paragraph>
          E-Mail:{' '}
          <Link href='mailto:jbaumann@uni-kassel.de' variant='underline'>
            jbaumann@uni-kassel.de
          </Link>
          <br /> Telefon: 49 561 804 5368
        </Paragraph>

        <Title size='five' className='mt-12'>
          Copyright
        </Title>
        <Paragraph>
          Alle Rechte vorbehalten. Die auf der Website verwendeten Texte,
          Bilder, Grafiken, Dateien usw. unterliegen dem Urheberrecht und
          anderen Gesetzen zum Schutz des geistigen Eigentums. Ihre Weitergabe,
          Veränderung, gewerbliche Nutzung oder Verwendung in anderen Websites
          oder Medien ist nicht gestattet.
        </Paragraph>

        <Title size='five' className='mt-12'>
          Datenschutz
        </Title>
        <Paragraph>
          Wir erheben, verarbeiten und nutzen Ihre Daten nur im Rahmen der
          gesetzlichen Bestimmungen. Diese Datenschutzerklärung gilt
          ausschließlich für die Nutzung der von uns angebotenen Webseiten. Sie
          gilt nicht für die Webseiten anderer Dienstanbieter, auf die wir
          lediglich durch einen Link verweisen. Bei der Nutzung unserer
          Webseiten bleiben Sie anonym, solange Sie uns nicht von sich aus
          freiwillig personenbezogene Daten zur Verfügung stellen.
          Personenbezogene Daten werden nur dann erhoben, wenn dies für die
          Nutzung der auf der Webseite angebotenen Leistungen, insbesondere
          Formularangebote, erforderlich ist.
        </Paragraph>
        <Paragraph>
          Die rechtlichen Grundlagen sind in unserer{' '}
          <Link href='/privacy' variant='underline'>
            Datenschutzerklärung (DSGVO)
          </Link>{' '}
          ersichtlich.
        </Paragraph>

        <Title size='five' className='mt-12'>
          Online-Streitschlichtungsplattform
        </Title>
        <Paragraph>
          Die Online-Streitschlichtungsplattform (OS-Plattform) der EU ist unter
          folgendem Link erreichbar:{' '}
          <Link
            href='https://ec.europa.eu/consumers/odr/'
            external
            variant='underline'
          >
            https://ec.europa.eu/consumers/odr/
          </Link>
        </Paragraph>
        <Paragraph>
          Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle sind wir nicht verpflichtet und
          grundsätzlich nicht bereit.
        </Paragraph>

        <Title size='five' className='mt-12'>
          Hinweis gemäß Teledienstgesetz
        </Title>
        <Paragraph>
          Für Websites Dritter, auf die der Herausgeber durch sogenannte Links
          verweist, tragen die jeweiligen Anbieter die Verantwortung. Der
          Herausgeber ist für den Inhalt solcher Sites Dritter nicht
          verantwortlich. Des weiteren kann die Website des Herausgebers ohne
          dessen Wissen von anderen Websites mittels sogenannter Links angelinkt
          werden. Der Herausgeber übernimmt keine Verantwortung für
          Darstellungen, Inhalt oder irgendeine Verbindung zur Parteigliederung
          des Herausgebers in Websites Dritter. Für fremde Inhalte ist der
          Herausgeber nur dann verantwortlich, wenn er von ihnen (d.h. auch von
          einem rechtswidrigen oder strafbaren Inhalt) positive Kenntnis hat und
          es dem Herausgeber technisch möglich und zumutbar ist, deren Nutzung
          zu verhindern. Der Herausgeber ist nach dem Teledienstgesetz jedoch
          nicht verpflichtet, die fremden Inhalte ständig zu überprüfen.
        </Paragraph>

        <Title size='five' className='mt-12'>
          Haftungsausschluss
        </Title>
        <Paragraph>
          Die Inhalte des Internetauftritts wurden mit größtmöglicher Sorgfalt
          und nach bestem Gewissen erstellt. Dennoch übernimmt der Anbieter
          dieser Webseite keine Gewähr für die Aktualität, Vollständigkeit und
          Richtigkeit der bereitgestellten Seiten und Inhalte.
        </Paragraph>
        <Paragraph>
          Als Diensteanbieter ist der Anbieter dieser Webseite gemäß § 7 Abs. 1
          TMG für eigene Inhalte und bereitgestellte Informationen auf diesen
          Seiten nach den allgemeinen Gesetzen verantwortlich; nach den §§ 8 bis
          10 TMG jedoch nicht verpflichtet, die übermittelten oder gespeicherten
          fremden Informationen zu überwachen. Eine Entfernung oder Sperrung
          dieser Inhalte erfolgt umgehend ab dem Zeitpunkt der Kenntnis einer
          konkreten Rechtsverletzung. Eine Haftung ist erst ab dem Zeitpunkt der
          Kenntniserlangung möglich.
        </Paragraph>

        <Title size='five' className='mt-12'>
          Wichtige Hinweise zu Links
        </Title>
        <Paragraph>
          Mit Urteil vom 12.05.1998 Az. 312 O 85/98 hat das LG Hamburg
          entschieden, dass durch die Anbringung eines Links die auf dieser
          Seite enthaltenen Informationen ggf. mit zu verantworten sind. Dies
          könne nach Auffassung des LG Hamburg nur dadurch vermieden werden,
          dass eine ausdrückliche Distanzierung erfolge. Dementsprechend
          distanzieren wir uns vorsorglich ausdrücklich von den Inhalten der
          Seiten, deren Links Sie hier finden oder die sonst über unsere Seite
          erreichbar sind. Die Inhalte dieser Seiten unterliegen ausschließlich
          dem Verantwortungsbereich Dritter. Wir haben auf die Inhalte keinen
          Einfluss, weshalb wir keinerlei Haftung für dort enthaltene
          Informationen übernehmen können und wollen.
        </Paragraph>
      </Container>
    </section>
  );
}
