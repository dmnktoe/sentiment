import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export default function GoodbyeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Sie wurden vom Newsletter abgemeldet</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Abmeldung bestätigt</Heading>
          <Text style={text}>
            Sie wurden erfolgreich vom Newsletter abgemeldet.
          </Text>
          <Text style={text}>
            Schade, dass Sie gehen! Falls Sie Ihre Meinung ändern, können Sie
            sich jederzeit wieder anmelden.
          </Text>
          <Text style={footer}>
            Falls Sie diese Abmeldung nicht durchgeführt haben, kontaktieren Sie
            uns bitte.
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
};

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: '700',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '26px',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '24px',
  marginTop: '32px',
};
