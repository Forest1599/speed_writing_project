import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy explains how we collect, use, and protect your information when you use our typing test application.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We collect the following information when you use our application:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Your username and encrypted password (for account access).</li>
        <li>Typing test performance data (such as typing speed, accuracy, and mistakes).</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Provide and improve the typing test experience.</li>
        <li>Analyze your performance to offer adaptive learning features.</li>
        <li>Maintain account access and allow you to track your typing progress.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Data Protection</h2>
      <p className="mb-4">
        We take appropriate measures to protect your information. Passwords are securely stored in an encrypted format, and we do not share your personal data with third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Your Rights</h2>
      <p className="mb-4">
        You have the right to:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Access the personal data we hold about you.</li>
        <li>Request deletion of your account and associated data at any time.</li>
      </ul>
      <p className="mb-4">
        To delete your account, you can use the "Delete Account" feature on your profile page.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Changes to This Policy</h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
      </p>

      <div className="text-center mt-10">
        <Link to="/" className="underline text-red-300 hover:text-red-500">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPage;