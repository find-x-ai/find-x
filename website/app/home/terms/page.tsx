import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Find-X",
};

const TermsOfServicePage = () => {
  return (
    <div className="mx-auto p-6 rounded-lg text-gray-200">
      <h1 className="sm:text-3xl text-2xl font-semibold mb-6 text-white">
        Terms of Service for Find-X
      </h1>
      <p className="text-sm text-gray-400 mb-4">
        Last Updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <p className="mb-4">
        By accessing or using Find-X, you agree to be bound by these Terms of
        Service. Please read them carefully before using our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">
        1. User Responsibilities
      </h2>
      <p className="mb-4">
        Users are solely responsible for the data they provide and collect
        through Find-X. Any misuse of the website's platform or data collection
        features is the user's responsibility.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
        2. Prohibited Activities
      </h2>
      <p className="mb-2">The following activities are strictly prohibited:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Violating any applicable laws or regulations</li>
        <li>Infringing on intellectual property rights</li>
        <li>Distributing malware or engaging in malicious activities</li>
        <li>Attempting to gain unauthorized access to Find-X systems</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
        3. Data Usage and Privacy
      </h2>
      <p className="mb-4">
        Users are responsible for ensuring they have the necessary rights and
        permissions for any data they collect or process using Find-X. Find-X is
        not liable for any data breaches or misuse resulting from user actions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
        4. Limitation of Liability
      </h2>
      <p className="mb-4">
        Find-X is provided "as is" without any warranties. We are not liable for
        any damages arising from the use of our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">
        5. Modifications to Terms
      </h2>
      <p className="mb-4">
        We reserve the right to modify these Terms of Service at any time.
        Continued use of Find-X after changes constitutes acceptance of the new
        terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">
        Contact Us
      </h2>
      <p className="mb-4">
        If you have any questions regarding these Terms of Service, please
        contact us at:
      </p>
      <p className="mb-4">
        Email:{" "}
        <a
          href="mailto:team@find-x.tech"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          team@find-x.tech
        </a>
      </p>
    </div>
  );
};

export default TermsOfServicePage;
