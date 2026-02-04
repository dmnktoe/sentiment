import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ConfirmSubscriptionEmailProps {
  confirmUrl: string;
}

export default function ConfirmSubscriptionEmail({
  confirmUrl,
}: ConfirmSubscriptionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bestätigen Sie Ihre Newsletter-Anmeldung - SENTIMENT</Preview>
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
          <Heading style={h1}>Newsletter-Anmeldung bestätigen</Heading>
          <Text style={text}>
            Vielen Dank für Ihr Interesse an unserem Newsletter!
          </Text>
          <Text style={text}>
            Um Ihre Anmeldung abzuschließen und regelmäßig Updates über das
            SENTIMENT-Projekt zu erhalten, klicken Sie bitte auf den folgenden
            Button:
          </Text>

          {/* Call-to-Action Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={confirmUrl}>
              Anmeldung jetzt bestätigen
            </Button>
          </Section>

          {/* Alternative Link */}
          <Text style={text}>
            Oder kopieren Sie diesen Link in Ihren Browser:
          </Text>
          <Text style={link}>{confirmUrl}</Text>

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            Falls Sie sich nicht für unseren Newsletter angemeldet haben, können
            Sie diese E-Mail ignorieren. Es werden keine weiteren E-Mails
            versendet.
          </Text>
          <Text style={footer}>
            Diese E-Mail wurde im Rahmen des Forschungsprojekts SENTIMENT
            versendet.
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

const buttonContainer = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#FF5C24', // Primary brand color (Orange)
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  lineHeight: '24px',
};

const link = {
  color: '#1F35A5', // Secondary brand color
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  marginTop: '8px',
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
