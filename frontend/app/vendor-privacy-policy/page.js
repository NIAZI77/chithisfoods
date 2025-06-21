import React from "react";

const Page = () => {
  return (
    <div className="bg-white rounded-2xl p-2 md:p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] md:w-[80%] w-[90%] mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vendor Privacy Policy for Chithi&apos;s Foods</h1>

      <div className="space-y-6">
        <section>
          <p className="text-gray-700 mb-4">
            At Chithi&apos;s Foods, we value the privacy and trust of our vendors. This Vendor Privacy Policy (&quot;Policy&quot;) outlines how we collect, use, disclose, and protect the personal and business information of our vendors. By partnering with Chithi&apos;s Foods, you agree to the practices described in this Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">We may collect the following types of information from our vendors:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Business Information:</strong> Business name, address, tax identification number, and other relevant business details.</li>
            <li><strong>Contact Information:</strong> Names, phone numbers, email addresses, and other contact details of authorized representatives.</li>
            <li><strong>Financial Information:</strong> Bank account details, payment history, and other financial information necessary for transactions.</li>
            <li><strong>Operational Information:</strong> Product details, inventory levels, delivery schedules, and performance metrics.</li>
            <li><strong>Technical Information:</strong> IP addresses, device information, and usage data when you access our vendor portal or platforms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To manage and maintain our business relationship with you.</li>
            <li>To process payments and invoices.</li>
            <li>To communicate with you about orders, deliveries, and other operational matters.</li>
            <li>To improve our services and vendor experience.</li>
            <li>To comply with legal and regulatory requirements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">We do not sell or rent your information to third parties. However, we may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Service Providers:</strong> With third-party service providers who assist us in payment processing, delivery, and other business operations.</li>
            <li><strong>Legal Compliance:</strong> When required by law or to protect our rights, property, or safety.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, where vendor information may be transferred as part of the transaction.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-gray-700">
            We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
          <p className="text-gray-700">
            We retain your information for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">Depending on your jurisdiction, you may have the following rights regarding your information:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Access:</strong> Request a copy of the information we hold about you.</li>
            <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request deletion of your information, subject to legal obligations.</li>
            <li><strong>Objection:</strong> Object to the processing of your information for specific purposes.</li>
          </ul>
          <p className="text-gray-700 mt-4">To exercise these rights, please contact us using the information provided below.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Policy from time to time. Any changes will be posted on our website, and we encourage you to review this Policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
          <p className="text-gray-700 mb-4">If you have any questions or concerns about this Vendor Privacy Policy, please contact us at:</p>
          <div className="pl-6 text-gray-700">
            <p className="font-semibold">Chithi&apos;s Foods</p>
            <p>Email: <a href="mailto:info@chithisfoods.com" className="text-rose-500 hover:text-rose-600 hover:underline">info@chithisfoods.com</a></p>
            <p>Phone: 312-985-6684</p>
            <p>Address: 2501 Chatham Rd Springfield, IL 62704</p>
          </div>
        </section>

        <section>
          <p className="text-gray-700">
            Thank you for partnering with Chithi&apos;s Foods. We are committed to protecting your privacy and ensuring a transparent and secure business relationship.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;
