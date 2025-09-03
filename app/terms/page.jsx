"use client";
import React from "react";
import Header from "../../components/Header";
import { Footer } from "../../components/Footer";

const TermsConditions = () => {
  return (
    <div>
      <Header />

      <div className="bg-[url('/shared/banner.png')] bg-cover bg-center text-white py-16 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold">Terms & Conditions</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-16 text-[#1C1C1C] leading-relaxed">
        <p className="mb-8">
          Welcome to vinX. These Terms & Conditions (“Terms”) govern your access to and use of our
          website, services, and vehicle history reports (“Services”). By using vinX, you agree to
          these Terms in full. If you do not agree, please refrain from using our Services.
        </p>

        {/* Section 1 */}
        <h2 className="font-semibold text-xl mb-3">1. Use of Service</h2>
        <p className="mb-2">
          vinX provides vehicle history reports based on VIN or license plate data. You agree to use
          the information only for lawful purposes, including personal vehicle research, buying or
          selling decisions, and dealership operations.
        </p>
        <p className="mb-2">You may not:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Resell, reproduce, or redistribute reports without written permission.</li>
          <li>Use reports for unlawful surveillance or investigation.</li>
          <li>Access or attempt to access data beyond what is made available to you.</li>
        </ul>

        {/* Section 2 */}
        <h2 className="font-semibold text-xl mb-3">2. Account & Payment</h2>
        <p className="mb-2">
          Some features may require account creation. You are responsible for maintaining the
          confidentiality of your account and payment details.
        </p>
        <p className="mb-2">Payment Terms:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Reports are sold on a per-use basis (no subscription required).</li>
          <li>All sales are final, except in cases of report delivery failure.</li>
          <li>Prices are displayed clearly before checkout and include applicable taxes (if any).</li>
        </ul>

        {/* Section 3 */}
        <h2 className="font-semibold text-xl mb-3">3. Report Accuracy & Limitations</h2>
        <p className="mb-2">
          We strive to provide accurate, up-to-date data sourced from insurers, government
          registries, repair shops, and other verified providers. However, vinX does not guarantee:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>That all accidents or incidents are reported.</li>
          <li>That all service history is complete.</li>
          <li>That all records are free from errors or omissions.</li>
        </ul>
        <p className="mb-6">
          Reports are informational and should be used alongside a professional vehicle inspection.
        </p>

        {/* Section 4 */}
        <h2 className="font-semibold text-xl mb-3">4. Intellectual Property</h2>
        <p className="mb-6">
          All content, reports, designs, logos, and platform technology are the property of vinX or
          its licensors. You may not copy, reverse-engineer, or create derivative works without
          permission.
        </p>

        {/* Section 5 */}
        <h2 className="font-semibold text-xl mb-3">5. Privacy</h2>
        <p className="mb-6">
          Our collection and use of personal information is governed by our [Privacy Policy]. By
          using our Services, you consent to that collection and use.
        </p>

        {/* Section 6 */}
        <h2 className="font-semibold text-xl mb-3">6. Disclaimers</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>vinX is not responsible for any decisions made solely based on the information in a report.</li>
          <li>All data is provided “as is” and “as available.”</li>
          <li>
            We do not provide any warranties, express or implied, regarding the completeness or
            accuracy of information.
          </li>
        </ul>

        {/* Section 7 */}
        <h2 className="font-semibold text-xl mb-3">7. Limitation of Liability</h2>
        <p className="mb-6">
          To the fullest extent permitted by law, vinX shall not be liable for any indirect,
          incidental, or consequential damages arising from the use of our Services. Our total
          liability for any claim will not exceed the amount paid for the report in question.
        </p>

        {/* Section 8 */}
        <h2 className="font-semibold text-xl mb-3">8. Changes to Terms</h2>
        <p className="mb-6">
          We may update these Terms from time to time. Any changes will be posted on this page with
          the updated date. Continued use of the Services after changes constitutes acceptance of the
          new Terms.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
