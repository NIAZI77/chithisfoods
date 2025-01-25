import Link from "next/link";
import React from "react";

const PiracyPolicyPage = () => {
  return (
    <div className="md:w-[80%] w-[90%] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Piracy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Introduction
        </h2>
        <p className="text-gray-600 leading-7">
          At {process.env.NEXT_PUBLIC_NAME}, we are committed to upholding the integrity of
          intellectual property and protecting the rights of creators. This
          Piracy Policy outlines our stance on piracy, explains prohibited
          activities, and outlines the consequences for engaging in piracy on
          our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Definition of Piracy
        </h2>
        <p className="text-gray-600 leading-7">
          Piracy refers to the unauthorized use, reproduction, distribution, or
          sharing of copyrighted material without the consent of the rightful
          owner. This includes illegal downloads, distribution of stolen
          content, or any form of content infringement that violates copyright
          laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Prohibited Activities
        </h2>
        <p className="text-gray-600 leading-7">
          The following activities are prohibited on {process.env.NEXT_PUBLIC_NAME} and may result
          in account suspension or other actions:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li className="text-gray-600">
            Uploading, sharing, or distributing pirated or copyrighted content
            without permission.
          </li>
          <li className="text-gray-600">
            Engaging in the sale or illegal distribution of content, including
            recipes or images, without authorization.
          </li>
          <li className="text-gray-600">
            Using our platform to promote or link to websites offering pirated
            material.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Consequences of Piracy
        </h2>
        <p className="text-gray-600 leading-7">
          If you are found engaging in piracy, we may take the following
          actions:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li className="text-gray-600">
            Suspension or termination of your account on {process.env.NEXT_PUBLIC_NAME}.
          </li>
          <li className="text-gray-600">
            Removal of infringing content from our platform.
          </li>
          <li className="text-gray-600">
            Legal actions, including the potential for fines or litigation,
            depending on the severity of the infringement.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Reporting Piracy
        </h2>
        <p className="text-gray-600 leading-7">
          If you believe that your content or intellectual property rights have
          been infringed upon, please contact us immediately. You can report
          piracy by submitting a notice to our support team at{" "}
          <Link href={`mailto:support@${process.env.NEXT_PUBLIC_NAME}.com`} className="text-blue-500">
            support@{process.env.NEXT_PUBLIC_NAME}.com
          </Link>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Actions We Take
        </h2>
        <p className="text-gray-600 leading-7">
          Upon receiving a piracy report, our team will investigate the claim
          and take appropriate action, which may include:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li className="text-gray-600">
            Removing the infringing content.
          </li>
          <li className="text-gray-600">
            Suspending the involved user’s account until the issue is resolved.
          </li>
          <li className="text-gray-600">
            Cooperating with legal authorities if necessary.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Collaboration with Copyright Holders
        </h2>
        <p className="text-gray-600 leading-7">
          {process.env.NEXT_PUBLIC_NAME} works diligently to comply with copyright laws and
          support copyright holders. We will remove infringing content and take
          appropriate actions in line with the Digital Millennium Copyright Act
          (DMCA) or any applicable local laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">Disclaimer</h2>
        <p className="text-gray-600 leading-7">
          While we take efforts to monitor and prevent piracy, {process.env.NEXT_PUBLIC_NAME} is
          not responsible for third-party content uploaded or shared by users.
          We rely on the community to report piracy and comply with legal
          procedures.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">Conclusion</h2>
        <p className="text-gray-600 leading-7">
          We are dedicated to protecting the rights of creators and ensuring a
          fair, legal environment for all users. By using our platform, you
          agree to comply with this piracy policy and help us uphold the law.
          Thank you for supporting ethical practices on {process.env.NEXT_PUBLIC_NAME}.
        </p>
      </section>
    </div>
  );
};

export default PiracyPolicyPage;
