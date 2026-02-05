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
      <Preview>Confirm your newsletter subscription - SENTIMENT</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Branding */}
          <Section style={header}>
            <table
              cellPadding='0'
              cellSpacing='0'
              border={0}
              style={{ margin: '0 auto' }}
            >
              <tr>
                <td align='center'>
                  <svg
                    width='50'
                    height='36'
                    viewBox='0 0 50 36'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    style={{ display: 'block', margin: '0 auto 16px' }}
                  >
                    <g clipPath='url(#clip0_75_52)'>
                      <path
                        d='M29.002 0H12.998C5.81942 0 0 5.73849 0 12.8173V23.1827C0 30.2615 5.81942 36 12.998 36H29.002C36.1806 36 42 30.2615 42 23.1827V12.8173C42 5.73849 36.1806 0 29.002 0Z'
                        fill='#FF5C24'
                      />
                      <path
                        d='M26.1822 20.0255V22.155C26.1822 23.0247 26.8975 23.73 27.7795 23.73H29.3225V20.0255H26.1828H26.1822Z'
                        fill='white'
                      />
                      <path
                        d='M29.3483 17.0946V19.224C29.3483 20.0937 30.0636 20.7991 30.9456 20.7991H32.4886V17.0946H29.349H29.3483Z'
                        fill='white'
                      />
                      <path
                        d='M12.6776 20.0255V22.155C12.6776 23.0247 13.3928 23.73 14.2748 23.73H15.8179V20.0255H12.6782H12.6776Z'
                        fill='white'
                      />
                      <path
                        d='M15.7791 23.2114V25.3408C15.7791 26.2105 16.4944 26.9159 17.3764 26.9159H26.1557V23.2114H15.7797H15.7791Z'
                        fill='white'
                      />
                      <path
                        d='M15.8114 9.25742V11.3868C15.8114 12.2566 16.5267 12.9619 17.4087 12.9619H18.9517V9.25742H15.812H15.8114Z'
                        fill='white'
                      />
                      <path
                        d='M23.0483 9.25742V11.3868C23.0483 12.2566 23.7636 12.9619 24.6456 12.9619H26.1886V9.25742H23.049H23.0483Z'
                        fill='white'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_75_52'>
                        <rect width='42' height='36' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </td>
              </tr>
            </table>
            <Heading style={logo}>SENTIMENT</Heading>
            <Text style={tagline}>
              Secure self-disclosure in intimate communication with dialog
              systems
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Heading style={h1}>Confirm newsletter subscription</Heading>
          <Text style={text}>
            Thank you for your interest in our newsletter!
          </Text>
          <Text style={text}>
            To complete your subscription and receive regular updates about the
            SENTIMENT project, please click the button below:
          </Text>

          {/* Call-to-Action Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={confirmUrl}>
              Confirm subscription now
            </Button>
          </Section>

          {/* Alternative Link */}
          <Text style={text}>Or copy this link into your browser:</Text>
          <Text style={link}>{confirmUrl}</Text>

          <Hr style={divider} />

          {/* Footer */}
          <Text style={footer}>
            If you did not sign up for our newsletter, you can ignore this
            email. No further emails will be sent.
          </Text>
          <Text style={footer}>
            This email was sent as part of the SENTIMENT research project.
          </Text>
          <Text style={disclaimer}>
            SENTIMENT is a research project under the funding guideline
            "Platform Privacy - IT security protects privacy and supports
            democracy" of the Federal Government's IT Security Research Program
            "Digital. Secure. Sovereign".
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
