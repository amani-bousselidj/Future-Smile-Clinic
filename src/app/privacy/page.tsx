/**
 * Privacy Policy Page
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p>
            Future Smile Clinic ("we", "us", "our", or "Company") operates the website. 
            This page informs you of our policies regarding the collection, use, and disclosure 
            of personal data when you use our service and the choices you have associated with that data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide 
            and improve our service to you.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Personal Data: Name, email address, phone number, date of birth, medical history</li>
            <li>Usage Data: Browser type, pages visited, time and date of visits</li>
            <li>Cookies: Small files stored on your device to enhance user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Data</h2>
          <p>Future Smile Clinic uses the collected data for various purposes:</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no method of 
            transmission over the Internet or method of electronic storage is 100% secure. 
            While we strive to use commercially acceptable means to protect your Personal Data, 
            we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the 
            "effective date" at the bottom of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>By email: privacy@futuresmileclinic.com</li>
            <li>By phone: +1 (555) 123-4567</li>
          </ul>
        </section>

        <div className="text-sm text-gray-500 pt-8 border-t">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
