import {
  Body,
  Button,
  Container,
  Head,
  Heading,
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
      <Preview>Bestätigen Sie Ihre Newsletter-Anmeldung</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Newsletter-Anmeldung bestätigen</Heading>
          <Text style={text}>
            Vielen Dank für Ihr Interesse an unserem Newsletter!
          </Text>
          <Text style={text}>
            Um Ihre Anmeldung abzuschließen, klicken Sie bitte auf den folgenden
            Button:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={confirmUrl}>
              Anmeldung bestätigen
            </Button>
          </Section>
          <Text style={text}>
            Oder kopieren Sie diesen Link in Ihren Browser:
          </Text>
          <Text style={link}>{confirmUrl}</Text>
          <Text style={footer}>
            Falls Sie sich nicht angemeldet haben, können Sie diese E-Mail
            ignorieren.
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

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px 20px',
};

const link = {
  color: '#000000',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '24px',
  marginTop: '32px',
};
