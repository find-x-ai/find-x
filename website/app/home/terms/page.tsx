import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Find-X",
};

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-white">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-100">1. Acceptance of Terms</h2>
          <p>By accessing or using Find-X, you agree to be bound by these Terms of Service.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-100">2. User Responsibilities</h2>
          <p>Users are solely responsible for the data they provide and collect through Find-X. Any misuse of the website's platform or data collection features is the user's responsibility.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-100">3. Prohibited Activities</h2>
          <ul className="list-disc pl-6">
            <li>Violating any applicable laws or regulations</li>
            <li>Infringing on intellectual property rights</li>
            <li>Distributing malware or engaging in malicious activities</li>
            <li>Attempting to gain unauthorized access to Find-X systems</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Usage and Privacy</h2>
          <p>Users are responsible for ensuring they have the necessary rights and permissions for any data they collect or process using Find-X. Find-X is not liable for any data breaches or misuse resulting from user actions.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p>Find-X is provided "as is" without any warranties. We are not liable for any damages arising from the use of our platform.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Modifications to Terms</h2>
          <p>We reserve the right to modify these Terms of Service at any time. Continued use of Find-X after changes constitutes acceptance of the new terms.</p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfServicePage