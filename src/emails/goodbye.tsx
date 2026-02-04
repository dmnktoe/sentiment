import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function GoodbyeEmail() {
  return (
    <Html>
      <Head />
      <Preview>
        Sie wurden vom SENTIMENT Newsletter abgemeldet
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Branding */}
          <Section style={header}>
            <Heading style={logo}>SENTIMENT</Heading>
            <Text style={tagline}>
              Sichere Selbstoffenbarung bei intimer Kommunikation mit
              Dialogsystemen
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Heading style={h1}>Abmeldung bestätigt</Heading>
          <Text style={text}>
            Sie wurden erfolgreich vom SENTIMENT Newsletter abgemeldet.
          </Text>
          <Text style={text}>
            Schade, dass Sie keine Updates mehr erhalten möchten! Falls Sie Ihre
            Meinung ändern, können Sie sich jederzeit wieder auf unserer Website
            anmelden.
          </Text>

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            Falls Sie diese Abmeldung nicht selbst durchgeführt haben,
            kontaktieren Sie uns bitte umgehend.
          </Text>
          <Text style={footer}>
            Vielen Dank für Ihr bisheriges Interesse am SENTIMENT-Projekt.
          </Text>
          <Text style={disclaimer}>
            SENTIMENT ist ein Forschungsprojekt im Rahmen der Förderrichtlinie
            "Plattform Privatheit – IT-Sicherheit schützt Privatheit und stützt
            Demokratie" des Forschungsrahmenprogramms der Bundesregierung zur
            IT-Sicherheit "Digital. Sicher. Souverän".
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  color: '#1F35A5', // Secondary brand color
  fontSize: '32px',
  fontWeight: '900',
  margin: '20px 0 8px',
  padding: '0',
  letterSpacing: '-0.5px',
};

const tagline = {
  color: '#8b9094', // Tertiary color
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 20px',
  padding: '0 20px',
};

const divider = {
  borderColor: '#f2f2f2',
  margin: '24px 0',
};

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: '700',
  margin: '32px 0 24px',
  padding: '0',
  lineHeight: '32px',
};

const text = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '16px',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '16px',
};

const disclaimer = {
  color: '#8b9094',
  fontSize: '11px',
  lineHeight: '18px',
  marginTop: '24px',
  paddingTop: '16px',
  borderTop: '1px solid #f2f2f2',
};
