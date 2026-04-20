import { NewsletterConfirmation } from '@/components/templates/NewsletterConfirmation';

export const metadata = {
  title: "That wasn't me",
  robots: { index: false, follow: false },
};

export default function NewsletterRejectPage(): React.ReactElement {
  return (
    <NewsletterConfirmation
      content={{
        endpoint: '/api/newsletter/reject',
        successRedirect: '/newsletter/rejected',
        heading: "That wasn't me",
        headingHighlight: "wasn't me",
        body: 'Someone entered your email address to subscribe to the SENTIMENT newsletter but never confirmed. Press the button below to delete that unconfirmed record from our system.',
        actionLabel: 'Delete record',
        actionLoadingLabel: 'Deleting...',
        tone: 'danger',
        hint: 'Your email address is not currently on the newsletter. Confirming here ensures that no unconfirmed record remains.',
      }}
    />
  );
}
