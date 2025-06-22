import React from "react";

const Page = () => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] md:w-[80%] w-[95%] mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <p className="text-gray-700 mb-4">Welcome to Chithi&apos;s Foods</p>
          <p className="text-gray-700 mb-4">
            Chithi&apos;s Foods provides an online marketplace where Sellers can list,
            offer, sell, and deliver food items and meals to customers.
            Customers can browse and purchase these items via the website and
            mobile applications (collectively referred to as the{" "}
            <strong>Service</strong>).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            This Privacy Policy outlines:
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>The information we collect.</li>
            <li>How we use and share that information.</li>
            <li>Your choices regarding our data practices.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Important Notice:</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              By using our Service, you agree to our Terms of Service and this
              Privacy Policy.
            </li>
            <li>If you disagree, do not access the site or use the Service.</li>
            <li>
              For questions, contact us at{" "}
              <a
                href="mailto:info@chithisfoods.com"
                className="text-rose-500 hover:text-rose-600 hover:underline"
              >
                info@chithisfoods.com
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <h3 className="text-lg font-medium mb-2">Information You Provide:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Profile Data:</strong> Includes name, email, phone number,
              address, account credentials, preferences, demographic details,
              and favorites.
            </li>
            <li>
              <strong>Messages:</strong> Content of messages, reviews, or
              feedback shared with us or publicly posted on the platform.
            </li>
            <li>
              <strong>Financial Data:</strong> Necessary payment details handled
              by Stripe, Inc.
            </li>
            <li>
              <strong>Employment Data:</strong> Information like employment and
              education history, transcripts, and references for job
              applications.
            </li>
            <li>
              <strong>Personal Contacts:</strong> Names, emails, and phone
              numbers of your contacts, collected with consent to fulfill
              specific requests.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            Usage of Personal Data:
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              To process transactions, improve the Service, and enhance user
              experience.
            </li>
            <li>
              Data shared through chat functionalities and other forms of
              communication.
            </li>
            <li>
              For more details on transactions, refer to Stripe&apos;s services
              agreement and privacy policy.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700 mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <div className="pl-6 text-gray-700">
            <p className="font-semibold">Chithi&apos;s Foods</p>
            <p>Email: <a href="mailto:info@chithisfoods.com" className="text-rose-500 hover:text-rose-600 hover:underline">info@chithisfoods.com</a></p>
            <p>Phone: 312-985-6684</p>
            <p>Address: 2501 Chatham Rd Springfield, IL 62704</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
