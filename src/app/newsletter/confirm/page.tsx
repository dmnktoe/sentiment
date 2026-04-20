import { NewsletterConfirmation } from '@/components/templates/NewsletterConfirmation';

export const metadata = {
  title: 'Confirm newsletter subscription',
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmPage(): React.ReactElement {
  return (
    <NewsletterConfirmation
      content={{
        endpoint: '/api/newsletter/confirm',
        successRedirect: '/newsletter/success',
        heading: 'Confirm subscription',
        headingHighlight: 'Confirm',
        body: 'Please confirm that you want to subscribe to the SENTIMENT newsletter. Once confirmed, you will receive our research updates.',
        actionLabel: 'Confirm subscription',
        actionLoadingLabel: 'Confirming...',
        hint: 'We trigger the confirmation only when you click this button, so email scanners and link previewers cannot activate your subscription by accident.',
      }}
    />
  );
}
