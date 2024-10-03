export const PrivacyPolicy = () => {
  return (
    <div className=" mx-auto p-6 rounded-lg text-gray-200">
      <h1 className="sm:text-3xl text-2xl font-semibold mb-6 text-white">
        Privacy Policy for Find-X
      </h1>
      <p className="text-sm text-gray-400 mb-4">Last updated: July 20, 2024</p>

      <p className="mb-4">
        This Privacy Policy outlines how Find-X collects, uses, and discloses
        your information when you utilise our services. By using our services,
        you consent to the collection and use of information in accordance with
        this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">
        Definitions
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          <strong>Account</strong>: A unique account created for you to access
          our service.
        </li>
        <li>
          <strong>Company</strong>: Find-X.
        </li>
        <li>
          <strong>Cookies</strong>: Small files placed on your device that track
          your browsing history and preferences.
        </li>
        <li>
          <strong>Personal Data</strong>: Information that identifies an
          individual.
        </li>
        <li>
          <strong>Service</strong>: Our website and associated services provided
          by Find-X.
        </li>
        <li>
          <strong>Usage Data</strong>: Data collected automatically when using
          the service (e.g., IP address, browser type, time spent on pages).
        </li>
        <li>
          <strong>You</strong>: The individual using the service.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Data Collection</h2>
      <p className="mb-2">
        We collect various types of information, including:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>Personal Data</strong>: Name, email address, website URL, and
          any other information you provide.
        </li>
        <li>
          <strong>Usage Data</strong>: Information on how you interact with our
          service, including pages visited and time spent.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Use of Data</h2>
      <p className="mb-2">We utilise your data to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide and maintain our service.</li>
        <li>Manage your account and user experience.</li>
        <li>
          Communicate with you regarding updates, offers, and relevant
          information.
        </li>
        <li>Analyse usage to enhance our service and user experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Data Sharing</h2>
      <p className="mb-2">We may share your data with:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>Service Providers</strong>: Third-party partners who assist in
          analyzing and improving our service.
        </li>
        <li>
          <strong>Business Transfers</strong>: In the event of a merger,
          acquisition, or sale of all or a portion of our assets.
        </li>
        <li>
          <strong>Affiliates</strong>: Companies related to us that may assist
          in providing our services.
        </li>
        <li>
          <strong>Business Partners</strong>: To offer promotions and relevant
          services.
        </li>
        <li>
          <strong>Other Users</strong>: When you engage in public areas of our
          service.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Your Information and Our Service
      </h2>
      <p className="mb-2">
        Upon signing up for our service, we collect the following information:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Name</li>
        <li>Email</li>
        <li>Website URL</li>
      </ul>

      <h3 className="text-xl font-semibold mt-4 mb-2">Process Steps:</h3>
      <ol className="list-decimal pl-6 mb-4">
        <li>
          <strong>Submit Valid Application Details</strong>: Ensure you provide
          accurate information when filling out our form.
        </li>
        <li>
          <strong>Data Collection</strong>: We gather publicly available data
          from your site if your details are validated.
        </li>
        <li>
          <strong>Receive API Key</strong>: After data collection, an API key
          will be sent to you via email.
        </li>
        <li>
          <strong>Ready to Serve</strong>: Follow our documentation to begin
          using our service.
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Data Security</h2>
      <p className="mb-4">
        We implement appropriate technical and organisational measures to
        protect your personal data from unauthorised access, use, or disclosure.
        However, no method of transmission over the internet or method of
        electronic storage is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">User Rights</h2>
      <p className="mb-2">You have the right to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Access your personal data.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your personal data.</li>
        <li>Object to or restrict the processing of your data.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">
        Contact Us
      </h2>
      <p className="mb-4">
        If you have any questions regarding this Privacy Policy, please contact
        us at:
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
