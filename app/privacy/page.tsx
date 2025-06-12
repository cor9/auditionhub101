import React from 'react';

const Privacy: React.FC = () => {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <p>
        Audition Hub 101 respects your privacy. This policy explains what we collect, how we use it, and your rights.
      </p>

      <h2>1. What We Collect</h2>
      <ul>
        <li>Account data (name, email, password)</li>
        <li>Audition info (notes, uploads, submissions)</li>
        <li>Device and usage data (IP, browser, analytics)</li>
        <li>Payments (processed via Stripe)</li>
      </ul>

      <h2>2. Why We Collect It</h2>
      <p>
        To provide services, generate reports, deliver content, and improve the app. We do not sell your data.
      </p>

      <h2>3. Cookies & Tracking</h2>
      <p>
        We use basic tracking like Google Analytics to improve UX. You can block cookies via your browser.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        Shared only with essential providers (Stripe, Airtable, MailerLite). Never sold. Only shared with authorities if legally required.
      </p>

      <h2>5. GDPR Rights (EU/UK Users)</h2>
      <ul>
        <li>Access your data</li>
        <li>Edit or delete it</li>
        <li>Export your data</li>
        <li>Object to processing</li>
      </ul>
      <p>To act on these, email <a href="mailto:privacy@childactor101.com">privacy@childactor101.com</a>.</p>

      <h2>6. CCPA Rights (California)</h2>
      <ul>
        <li>Know what data we collect</li>
        <li>Request deletion or corrections</li>
        <li>Opt-out of sale (we don’t sell it, but you can opt out anyway)</li>
      </ul>

      <h2>7. Children's Privacy</h2>
      <p>
        Under 13 requires parent/guardian supervision. We don’t knowingly collect personal data from minors without consent.
      </p>

      <h2>8. Data Retention & Security</h2>
      <p>
        We keep your data while your account is active. Your data is encrypted and stored securely.
        Delete your account anytime by request.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We’ll update this page if our policy changes. Continued use = agreement to updates.
      </p>

      <h2>10. Contact</h2>
      <p>
        Email: <a href="mailto:privacy@childactor101.com">privacy@childactor101.com</a>
      </p>
    </main>
  );
};

export default Privacy;
