import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="w-[95%] mx-auto px-4 py-8">
      <h1 className="md:text-2xl text-xl font-semibold text-center mb-6">
        Privacy Policy
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to Chithis, Inc.
        </h2>
        <p className="text-gray-700 mb-4">
          Chithis, Inc. (&quot;Chithis,&quot; &quot;we,&quot; &quot;our,&quot;
          or &quot;us&quot;) is committed to protecting and respecting your
          privacy. This Privacy Policy explains how we collect, use, share, and
          protect your information when you access and use our website, mobile
          applications, and related services (collectively, the
          &quot;Service&quot;).
        </p>
        <p className="text-gray-700 mb-4">
          By using our Service, you agree to the terms of this Privacy Policy.
          If you disagree with any part of this policy, please refrain from
          using the Service.
        </p>
        <p className="text-gray-700 mb-4">
          For any questions regarding this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@chithis.com" className="text-blue-500">
            privacy@chithis.com
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          1. Information We Collect
        </h2>

        <h3 className="text-xl font-medium mb-2">A. Information You Provide</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            <strong>Profile Data</strong> Includes your name, email address,
            phone number, physical address, account credentials, preferences,
            demographic details, and favorite items.
          </li>
          <li>
            <strong>Messages</strong> Any content of messages, reviews,
            feedback, or comments you share with us or post publicly on our
            platform.
          </li>
          <li>
            <strong>Financial Data</strong> Necessary payment details for
            processing transactions. This information is handled by a
            third-party payment processor, Stripe, Inc.
          </li>
          <li>
            <strong>Employment Data</strong> Information such as your employment
            history, educational background, transcripts, and references when
            you apply for a job.
          </li>
          <li>
            <strong>Personal Contacts</strong> If you provide personal contact
            information, such as names, email addresses, and phone numbers of
            individuals in your network, we collect this data with your consent
            for specific requests.
          </li>
        </ul>

        <h3 className="text-xl font-medium mb-2">B. Usage Data</h3>
        <p className="text-gray-700 mb-4">
          We may collect information about your interactions with the Service,
          including how you navigate our website or app, the pages you visit,
          items you view or purchase, and other actions you take while using the
          Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            <strong>To Process Transactions</strong> We use your financial data
            to complete transactions related to your purchases and other
            activities within the Service.
          </li>
          <li>
            <strong>To Improve the Service</strong> We analyze usage data to
            enhance and personalize your experience, improve the functionality
            of the Service, and address issues.
          </li>
          <li>
            <strong>Communication</strong> We use your contact information to
            respond to your inquiries, send service updates, and provide
            customer support.
          </li>
          <li>
            <strong>To Process Applications</strong> If you apply for a job with
            us, we use your employment data to evaluate your application.
          </li>
          <li>
            <strong>To Send Marketing Communications</strong> With your consent,
            we may send you promotional information, but you can opt out at any
            time.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <p className="text-gray-700 mb-4">
          We do not sell or rent your personal data. However, we may share your
          information with trusted third parties in the following ways:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            <strong>Service Providers</strong> We may share data with service
            providers like Stripe, Inc., who process payments and provide other
            essential services.
          </li>
          <li>
            <strong>Legal Requirements</strong> We may disclose your information
            if required to do so by law, in response to a legal request, or to
            protect our legal rights.
          </li>
          <li>
            <strong>Business Transfers</strong> If Chithis is involved in a
            merger, acquisition, or sale of assets, your information may be
            transferred as part of that transaction.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Your Choices Regarding Your Data
        </h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            <strong>Access and Update Information</strong> You can access and
            update your personal information by logging into your account or
            contacting us directly.
          </li>
          <li>
            <strong>Marketing Communications</strong> You may opt out of
            receiving marketing communications by following the unsubscribe
            instructions in each communication or by contacting us.
          </li>
          <li>
            <strong>Deleting Your Account</strong> If you wish to delete your
            account and the information associated with it, please contact us at{" "}
            <a href="mailto:privacy@chithis.com" className="text-blue-500">
              privacy@chithis.com
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Security of Your Information
        </h2>
        <p className="text-gray-700 mb-4">
          We take reasonable steps to protect your information, but no method of
          data transmission or storage is 100% secure. While we strive to use
          commercially acceptable means to protect your personal data, we cannot
          guarantee its absolute security.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
