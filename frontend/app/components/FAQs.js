import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  // From Terms and Conditions
  {
    title: "What are the age requirements to use Chithi's Foods services?",
    content:
      "You must be at least 18 years old or have the consent of a parent or legal guardian to use our Services. You also agree to comply with all applicable laws and regulations.",
  },
  {
    title: "What is Chithi's Foods refund and return policy?",
    content:
      "Refunds may be issued for canceled orders or in cases of incorrect or unsatisfactory orders. Refund eligibility is determined on a case-by-case basis. If you receive a damaged or incorrect product, please contact us within 24 hours of delivery to arrange a return or replacement.",
  },
  // From Privacy Policy
  {
    title:
      "What personal information does Chithi's Foods collect from customers?",
    content:
      "We collect profile data (name, email, phone number, address, account credentials, preferences, demographic details, favorites), messages (content of messages, reviews, feedback), financial data (payment details handled by Stripe), employment data (for job applications), and personal contacts (names, emails, phone numbers with consent).",
  },
  {
    title: "How does Chithi's Foods use my personal data?",
    content:
      "We use your personal data to process transactions, improve the Service, and enhance user experience. Data is shared through chat functionalities and other forms of communication. For more details on transactions, refer to Stripe's services agreement and privacy policy.",
  },
  // From Vendor Privacy Policy
  {
    title: "What information does Chithi's Foods collect from vendors?",
    content:
      "We collect business information (business name, address, tax ID), contact information (names, phone numbers, email addresses), financial information (bank account details, payment history), operational information (product details, inventory levels, delivery schedules), and technical information (IP addresses, device information, usage data) when you access our vendor portal.",
  },
  {
    title: "How does Chithi's Foods protect vendor data security?",
    content:
      "We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
  },
];

const FAQs = () => {
  return (
    <div className="w-[90%] mx-auto p-6 mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full my-4">
        {items.map(({ title, content }, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-rose-600 hover:text-rose-700 [&>svg]:text-rose-500 text-base">
              {title}
            </AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQs;
