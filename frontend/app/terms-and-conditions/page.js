// app/terms-and-conditions/page.jsx
import Link from "next/link";
import React from "react";

const TermsAndConditionsPage = () => {
  return (
    <div className="md:w-[80%] w-[90%] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Terms and Conditions
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Introduction
        </h2>
        <p className="text-gray-600 leading-7">
          Welcome to {process.env.NEXT_PUBLIC_NAME}! By accessing or using our website and
          services, you agree to be bound by these Terms and Conditions. If you
          do not agree with any part of these terms, please do not use our
          platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Acceptance of Terms
        </h2>
        <p className="text-gray-600 leading-7">
          By using {process.env.NEXT_PUBLIC_NAME}, you confirm that you are legally capable of
          entering into binding agreements and that you agree to comply with
          these Terms and Conditions. Your use of our services constitutes your
          acceptance of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Use of the Platform
        </h2>
        <p className="text-gray-600 leading-7">
          You agree to use {process.env.NEXT_PUBLIC_NAME} in compliance with applicable laws. You
          will not use the platform for any illegal or unauthorized purposes,
          including but not limited to distributing malicious software, engaging
          in fraudulent activities, or violating the rights of others.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Account Registration
        </h2>
        <p className="text-gray-600 leading-7">
          To access certain features, you may need to create an account. You are
          responsible for maintaining the confidentiality of your account
          details and for all activities under your account. You agree to notify
          us immediately if you suspect any unauthorized access to your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Content Ownership
        </h2>
        <p className="text-gray-600 leading-7">
          You retain ownership of any content you upload to {process.env.NEXT_PUBLIC_NAME}.
          However, by uploading content, you grant {process.env.NEXT_PUBLIC_NAME} a non-exclusive,
          royalty-free license to use, display, and distribute such content on
          the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Intellectual Property
        </h2>
        <p className="text-gray-600 leading-7">
          All intellectual property, trademarks, logos, and other content
          provided on the platform are the property of {process.env.NEXT_PUBLIC_NAME} or its
          licensors. You may not use, copy, or distribute any of this
          intellectual property without our explicit permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Privacy Policy
        </h2>
        <p className="text-gray-600 leading-7">
          Your use of {process.env.NEXT_PUBLIC_NAME} is also governed by our Privacy Policy.
          Please review our Privacy Policy to understand how we collect, use,
          and protect your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Limitation of Liability
        </h2>
        <p className="text-gray-600 leading-7">
          {process.env.NEXT_PUBLIC_NAME} is not liable for any indirect, incidental, or
          consequential damages arising from your use of the platform. We make
          no guarantees about the availability or reliability of the services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Termination of Account
        </h2>
        <p className="text-gray-600 leading-7">
          We reserve the right to suspend or terminate your account at any time,
          without notice, if we believe you have violated these Terms and
          Conditions or engaged in illegal activity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Governing Law
        </h2>
        <p className="text-gray-600 leading-7">
          These Terms and Conditions are governed by the laws of the country or
          jurisdiction in which {process.env.NEXT_PUBLIC_NAME} operates. Any disputes arising from
          the use of the platform will be resolved under these laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Changes to the Terms
        </h2>
        <p className="text-gray-600 leading-7">
          We may update these Terms and Conditions from time to time. Any
          changes will be posted on this page, and by continuing to use the
          platform, you accept the updated terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Contact Information
        </h2>
        <p className="text-gray-600 leading-7">
          If you have any questions about these Terms and Conditions, please
          contact us at{" "}
          <Link href={`mailto:support@${process.env.NEXT_PUBLIC_NAME}.com`} className="text-blue-500">
            support@{process.env.NEXT_PUBLIC_NAME}.com
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;
