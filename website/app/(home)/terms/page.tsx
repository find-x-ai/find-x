import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const TermsOfServicePage = () => {
  return (
    <div className="mx-auto p-6 rounded-lg text-gray-200">
      <h1 className="text-2xl font-semibold mb-4 text-white">
        FIND-X Terms of Service
      </h1>
      <p className="text-sm text-gray-400 mb-6">Effective: 15th Feb 2025</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">The Basics</h2>
          <p className="text-gray-300">
            By using FIND-X, you agree to these simple terms. We've tried to make
            them clear and fair.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">
            What You Can Expect From Us
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>A search service that respects website owners' rules</li>
            <li>Clear communication about service changes</li>
            <li>Protection of your data as outlined in our Privacy Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">
            What We Expect From You
          </h2>
          <div className="text-gray-300 space-y-2">
            <p>When using FIND-X:</p>
            <ul className="list-disc pl-6">
              <li>Only submit websites you have rights to search</li>
              <li>Don't try to break our systems</li>
              <li>Follow applicable laws</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Simple Rules</h2>
          <div className="text-gray-300 space-y-2">
            <p>Never use FIND-X to:</p>
            <ul className="list-disc pl-6">
              <li>Harvest personal information improperly</li>
              <li>Bypass website security measures</li>
              <li>Create spam or malicious content</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Our Responsibility</h2>
          <div className="text-gray-300 space-y-2">
            <p>We'll:</p>
            <ul className="list-disc pl-6">
              <li>Keep FIND-X running smoothly</li>
              <li>Fix critical issues quickly</li>
              <li>Give 30 days notice for major service changes</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Payments & Refunds</h2>
          <div className="text-gray-300 space-y-2">
            <p>If we charge for services:</p>
            <ul className="list-disc pl-6">
              <li>You'll get clear pricing upfront</li>
              <li>Can cancel anytime</li>
              <li>Get prorated refunds for annual plans</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Changes to Terms</h2>
          <p className="text-gray-300">
            We'll email users about significant changes 14 days before they take
            effect. Current terms always available at{" "}
            <span className="text-blue-400">find-x.tech/terms</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Need Help?</h2>
          <p className="text-gray-300">
            Email us at{" "}
            <a
              href="mailto:sahil.findx@gmail.com"
              className="text-blue-400 hover:underline"
            >
              sahil.findx@gmail.com
            </a>{" "}
            with any questions - we usually respond within 24 hours.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            These terms apply to all FIND-X services. Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;