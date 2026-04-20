import { NewsletterConfirmation } from '@/components/templates/NewsletterConfirmation';

export const metadata = {
  title: 'Unsubscribe from newsletter',
  robots: { index: false, follow: false },
};

export default function NewsletterUnsubscribePage(): React.ReactElement {
  return (
    <NewsletterConfirmation
      content={{
        endpoint: '/api/newsletter/unsubscribe',
        successRedirect: '/newsletter/unsubscribed',
        heading: 'Unsubscribe confirmation',
        headingHighlight: 'Unsubscribe',
        body: 'We are sorry to see you go. Please confirm that you want to unsubscribe from the SENTIMENT newsletter.',
        actionLabel: 'Unsubscribe now',
        actionLoadingLabel: 'Unsubscribing...',
        tone: 'danger',
        hint: 'We only unsubscribe you when you press this button, so automated link scanners in your inbox cannot trigger it.',
      }}
    />
  );
}
