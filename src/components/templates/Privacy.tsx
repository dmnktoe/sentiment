import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Link } from '@/components/ui/Link';
import { List, ListItem } from '@/components/ui/List';
import { Paragraph, Title } from '@/components/ui/typography';

export default function Privacy() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <Title size='two' className='leading-none'>
          Datenschutzerklärung
        </Title>
        <Title size='five' className='mt-12'>
          1. Erfassung allgemeiner Daten und Informationen (Server-Logfiles)
        </Title>
        <Paragraph>
          Beim Aufruf dieser Website werden automatisch Informationen erfasst,
          die Ihr Browser an den Server übermittelt. Diese Daten werden in
          sogenannten Server-Logfiles gespeichert. Erfasst werden können:
        </Paragraph>
        <List>
          <ListItem>Browsertyp und Browserversion</ListItem>
          <ListItem>verwendetes Betriebssystem</ListItem>
          <ListItem>Referrer-URL</ListItem>
          <ListItem>Unterseiten, die aufgerufen werden</ListItem>
          <ListItem>Datum und Uhrzeit des Zugriffs</ListItem>
          <ListItem>IP-Adresse</ListItem>
          <ListItem>Internet-Service-Provider</ListItem>
        </List>
        <Paragraph>
          Diese Daten werden ausschließlich zur Gewährleistung eines
          störungsfreien Betriebs der Website, zur Verbesserung unseres Angebots
          sowie zur Gewährleistung der IT-Sicherheit ausgewertet. Eine
          Zusammenführung dieser Daten mit anderen Datenquellen erfolgt nicht.
        </Paragraph>
        <Paragraph>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          einem sicheren und funktionsfähigen Betrieb der Website)
        </Paragraph>

        <Title size='five' className='mt-12'>
          2. Hosting über Vercel
        </Title>
        <Paragraph>
          Diese Website wird über die Plattform Vercel Inc. betrieben. Beim
          Aufruf der Website werden die oben genannten Server-Logfiles auch auf
          den Servern von Vercel verarbeitet. Vercel handelt als
          Auftragsverarbeiter und verarbeitet Daten ausschließlich nach unseren
          Weisungen.
        </Paragraph>
        <Paragraph>
          Weitere Informationen finden Sie in der{' '}
          <Link
            href='https://vercel.com/legal/privacy-policy'
            external
            variant='underline'
          >
            Datenschutzerklärung von Vercel
          </Link>
          .
        </Paragraph>
        <Paragraph>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          einem sicheren und funktionsfähigen Betrieb der Website)
        </Paragraph>

        <Title size='five' className='mt-12'>
          3. Cookies
        </Title>
        <Paragraph>
          Diese Website verwendet ausschließlich technisch notwendige Cookies.
          Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert
          werden und keine Schäden verursachen.
        </Paragraph>
        <Paragraph>
          Sie können die Speicherung von Cookies durch entsprechende
          Einstellungen in Ihrem Browser verhindern. In diesem Fall kann es
          jedoch zu Funktionseinschränkungen dieser Website kommen.
        </Paragraph>
        <Paragraph>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          der technischen Funktionalität der Website)
        </Paragraph>

        <Title size='five' className='mt-12'>
          4. Kontaktaufnahme per E-Mail
        </Title>
        <Paragraph>
          Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen
          übermittelten personenbezogenen Daten (z. B. Name, E-Mail-Adresse,
          Inhalt der Nachricht) gespeichert, um Ihre Anfrage zu bearbeiten. Eine
          Weitergabe an Dritte erfolgt nicht.
        </Paragraph>
        <Paragraph>Rechtsgrundlage:</Paragraph>
        <List>
          <ListItem>
            Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen)
          </ListItem>
          <ListItem>
            Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
            Bearbeitung von Anfragen)
          </ListItem>
        </List>

        <Title size='five' className='mt-12'>
          5. Weitergabe von Daten
        </Title>
        <Paragraph>
          Eine Übermittlung Ihrer personenbezogenen Daten an Dritte findet nicht
          statt, es sei denn:
        </Paragraph>
        <List>
          <ListItem>Sie haben ausdrücklich eingewilligt</ListItem>
          <ListItem>die Weitergabe ist gesetzlich vorgeschrieben</ListItem>
          <ListItem>
            sie ist zur Durchsetzung rechtlicher Ansprüche erforderlich
          </ListItem>
        </List>

        <Title size='five' className='mt-12'>
          6. Dauer der Speicherung
        </Title>
        <Paragraph>
          Personenbezogene Daten werden nur so lange gespeichert, wie dies für
          die jeweiligen Verarbeitungszwecke erforderlich ist oder gesetzliche
          Aufbewahrungsfristen bestehen. Nach Wegfall des Zwecks oder Ablauf der
          Fristen werden die Daten routinemäßig gelöscht.
        </Paragraph>

        <Title size='five' className='mt-12'>
          7. Rechte der betroffenen Person
        </Title>
        <Paragraph>Sie haben jederzeit folgende Rechte:</Paragraph>
        <List>
          <ListItem>Recht auf Auskunft (Art. 15 DSGVO)</ListItem>
          <ListItem>Recht auf Berichtigung (Art. 16 DSGVO)</ListItem>
          <ListItem>Recht auf Löschung (Art. 17 DSGVO)</ListItem>
          <ListItem>
            Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
          </ListItem>
          <ListItem>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</ListItem>
          <ListItem>Recht auf Widerspruch (Art. 21 DSGVO)</ListItem>
          <ListItem>
            Recht auf Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)
          </ListItem>
        </List>
        <Paragraph>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannten
          Kontaktadressen.
        </Paragraph>

        <Title size='five' className='mt-12'>
          8. Beschwerderecht bei der Aufsichtsbehörde
        </Title>
        <Paragraph>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über
          die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
        </Paragraph>

        <Title size='five' className='mt-12'>
          9. Automatisierte Entscheidungsfindung / Profiling
        </Title>
        <Paragraph>
          Eine automatisierte Entscheidungsfindung oder ein Profiling findet auf
          dieser Website nicht statt.
        </Paragraph>

        <Title size='five' className='mt-12'>
          10. Änderung dieser Datenschutzerklärung
        </Title>
        <Paragraph>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an
          rechtliche Anforderungen oder Änderungen unseres Angebots anzupassen.
          Es gilt jeweils die aktuelle, auf dieser Website veröffentlichte
          Fassung.
        </Paragraph>
      </Container>
    </section>
  );
}
