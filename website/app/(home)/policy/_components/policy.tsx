export const PrivacyPolicy = () => {
  return (
    <div className="mx-auto p-6 rounded-lg text-gray-200">
      <h1 className="text-2xl font-semibold mb-4 text-white">
        FIND-X Privacy Policy
      </h1>
      <p className="text-sm text-gray-400 mb-6">Effective: [soon]</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">The Short Version</h2>
          <p className="text-gray-300">
            We only collect what's necessary to provide our search service. 
            We don't sell your data. We respect website owners' rules.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">What We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Account Info:</strong> Just your email and name</li>
            <li><strong>Search Data:</strong> Websites you ask us to index</li>
            <li><strong>Basic Usage:</strong> How you interact with our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">How We Use It</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Create your search index</li>
            <li>Improve our service</li>
            <li>Send important updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Website Scraping</h2>
          <div className="text-gray-300 space-y-2">
            <p>When you give us a website to index:</p>
            <ul className="list-disc pl-6">
              <li>We only access public pages</li>
              <li>We obey robots.txt rules</li>
              <li>We never store sensitive info</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Data Security</h2>
          <div className="text-gray-300 space-y-2">
            <p>We protect your data with:</p>
            <ul className="list-disc pl-6">
              <li>Industry-standard encryption</li>
              <li>Regular security updates</li>
              <li>Limited team access</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Your Control</h2>
          <div className="text-gray-300 space-y-2">
            <p>You can always:</p>
            <ul className="list-disc pl-6">
              <li>Delete your account</li>
              <li>Request your data</li>
              <li>Ask us to stop processing</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Third Parties</h2>
          <div className="text-gray-300 space-y-2">
            <p>We only share data with:</p>
            <ul className="list-disc pl-6">
              <li>Our hosting provider ([Cloud Provider])</li>
              <li>Essential service tools (e.g., email delivery)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Need Help?</h2>
          <p className="text-gray-300">
            Email us at{" "}
            <a href="mailto:support@find-x.tech" className="text-blue-400 hover:underline">
              support@find-x.tech
            </a>{" "}
            with any questions.
          </p>
        </section>

        <div className="pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            We'll update this policy as we grow. Major changes will be emailed to users.
          </p>
        </div>
      </div>
    </div>
  );
};