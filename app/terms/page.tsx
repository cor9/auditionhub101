import React from 'react';

const Terms: React.FC = () => {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Terms of Service</h1>
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <p>
        Welcome to <strong>Audition Hub 101</strong>, part of the Child Actor 101 platform operated by Corey Ralston.
        By using our app and services, you agree to the terms below.
      </p>

      <h2>1. Eligibility & Accounts</h2>
      <p>
        You must be at least 13 years old to use this app directly. Under 13? A parent or guardian must manage the account.
      </p>

      <h2>2. Acceptable Use</h2>
      <ul>
        <li>No impersonation or false info</li>
        <li>No spam, scraping, hacking, or illegal activity</li>
        <li>No uploading copyrighted or offensive material</li>
      </ul>

      <h2>3. Payments & Subscriptions</h2>
      <p>
        Some features require payment via Stripe. Subscriptions renew automatically until cancelled.
        Cancel anytime in the app or by contacting support.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        You own your content. We own the app and materials. Don’t resell or copy our stuff.
      </p>

      <h2>5. DMCA Notice</h2>
      <p>
        Report infringement to <a href="mailto:support@childactor101.com">support@childactor101.com</a> with a detailed notice.
      </p>

      <h2>6. Disclaimers</h2>
      <p>
        We don’t guarantee casting success or 24/7 uptime. This is a helpful tool, not a promise.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        We’re not liable for indirect damages. Maximum liability is what you’ve paid us in the last 12 months.
      </p>

      <h2>8. Arbitration & Governing Law</h2>
      <p>
        Disputes go to binding arbitration in California. No class-action suits.
      </p>

      <h2>9. Business Use</h2>
      <p>
        App is for personal use unless otherwise licensed. Enterprise use may require written approval.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update terms. Continued use means continued agreement.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions? Email <a href="mailto:support@childactor101.com">support@childactor101.com</a>
      </p>
    </main>
  );
};

export default Terms;
