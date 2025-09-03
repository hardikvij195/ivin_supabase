"use client";
import React from "react";
import Header from "../../components/Header";
import { Footer } from "../../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />

      {/* Banner */}
      <div className="bg-[url('/shared/banner.png')] font-fredoka font-semibold text-[30px] lg:text-[40px] text-center bg-cover bg-center text-white flex items-center justify-center h-53">
        <h1 className="text-3xl lg:text-4xl font-bold">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-16 text-[#1C1C1C] leading-relaxed">
        <p className="mb-6">
          At vinX, your privacy is important to us. This Privacy Policy explains how we collect, use,
          disclose, and protect your information when you visit our website or use our services.
        </p>
        <p className="mb-8">
          By using vinX, you agree to the terms outlined in this policy.
        </p>

        {/* Section 1 */}
        <h2 className="font-semibold text-xl mb-3">1. Information We Collect</h2>
        <p className="mb-2">We collect personal and non-personal information in the following ways:</p>
        <p className="font-semibold">a. Information You Provide</p>
        <ul className="list-disc pl-6 mb-3">
          <li>VIN or license plate number</li>
          <li>Email address (if creating an account or buying a service)</li>
          <li>Payment details (processed securely through third-party providers)</li>
          <li>Support inquiries or feedback</li>
        </ul>
        <p className="font-semibold">b. Information We Collect Automatically</p>
        <ul className="list-disc pl-6 mb-6">
          <li>IP address</li>
          <li>Browser and device type</li>
          <li>Pages visited and interaction behavior</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        {/* Section 2 */}
        <h2 className="font-semibold text-xl mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Generate and deliver vehicle history reports</li>
          <li>Process payments and provide transaction receipts</li>
          <li>Respond to support inquiries and requests</li>
          <li>Improve website performance and user experience</li>
          <li>Send updates, newsletters, or promotional emails (only if you opt in)</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>

        {/* Section 3 */}
        <h2 className="font-semibold text-xl mb-3">3. Sharing of Information</h2>
        <p className="mb-2">We do not sell your personal data. We may share your information with:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Trusted third-party service providers (e.g., payment processors, email platforms)</li>
          <li>Government or law enforcement authorities if legally required</li>
          <li>Data partners and providers strictly for report generation purposes</li>
        </ul>
        <p className="mb-6">
          All partners are obligated to handle your data securely and in accordance with privacy laws.
        </p>

        {/* Section 4 */}
        <h2 className="font-semibold text-xl mb-3">4. Cookies & Tracking Technologies</h2>
        <p className="mb-2">vinX uses cookies to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Understand how users interact with our site</li>
          <li>Save your preferences</li>
          <li>Improve functionality and personalize your experience</li>
        </ul>
        <p className="mb-6">You can manage cookie settings through your browser at any time.</p>

        {/* Section 5 */}
        <h2 className="font-semibold text-xl mb-3">5. Data Security</h2>
        <p className="mb-2">We implement industry-standard security measures to protect your data:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>SSL encryption on all data transmissions</li>
          <li>Secure servers and infrastructure</li>
          <li>Regular vulnerability assessments</li>
        </ul>
        <p className="mb-6">
          However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        {/* Section 6 */}
        <h2 className="font-semibold text-xl mb-3">6. Your Rights & Choices</h2>
        <p className="mb-2">You have the right to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Access and request a copy of your data</li>
          <li>Correct inaccurate information</li>
          <li>Withdraw consent or request deletion of your data</li>
          <li>Opt out of promotional communications at any time</li>
        </ul>
        <p className="mb-6">
          To exercise your rights, contact us via [Contact Support].
        </p>

        {/* Section 7 */}
        <h2 className="font-semibold text-xl mb-3">7. Third-Party Links</h2>
        <p className="mb-6">
          Our website may contain links to external websites. We are not responsible for their privacy practices.
          Please review their policies before providing personal information.
        </p>

        {/* Section 8 */}
        <h2 className="font-semibold text-xl mb-3">8. Children's Privacy</h2>
        <p className="mb-6">
          vinX is not intended for use by children under the age of 16. We do not knowingly collect data from children.
          If we learn that we have, we will delete the data promptly.
        </p>

        {/* Section 9 */}
        <h2 className="font-semibold text-xl mb-3">9. Updates to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy periodically. All changes will be posted on this page with the updated date.
          Your continued use of the site constitutes acceptance of the changes.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
