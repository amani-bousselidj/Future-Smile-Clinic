/**
 * Terms of Service Page
 */
export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing and using the Future Smile Clinic website, you accept and agree to be 
            bound by the terms and provision of this agreement. If you do not agree to abide 
            by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials 
            (information or software) on Future Smile Clinic's website for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a 
            transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the website</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
          <p>
            The materials on Future Smile Clinic's website are provided "as is". Future Smile 
            Clinic makes no warranties, expressed or implied, and hereby disclaims and negates 
            all other warranties including, without limitation, implied warranties or conditions 
            of merchantability, fitness for a particular purpose, or non-infringement of 
            intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
          <p>
            In no event shall Future Smile Clinic or its suppliers be liable for any damages 
            (including, without limitation, damages for loss of data or profit, or due to business 
            interruption) arising out of the use or inability to use the materials on 
            Future Smile Clinic's website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Future Smile Clinic's website could include technical, 
            typographical, or photographic errors. Future Smile Clinic does not warrant that any 
            of the materials on its website are accurate, complete, or current. Future Smile Clinic 
            may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Links</h2>
          <p>
            Future Smile Clinic has not reviewed all of the sites linked to its website and is 
            not responsible for the contents of any such linked site. The inclusion of any link 
            does not imply endorsement by Future Smile Clinic of the site. Use of any such linked 
            website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
          <p>
            Future Smile Clinic may revise these terms of service for its website at any time 
            without notice. By using this website you are agreeing to be bound by the then 
            current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws 
            of the United States, and you irrevocably submit to the exclusive jurisdiction of 
            the courts in that location.
          </p>
        </section>

        <div className="text-sm text-gray-500 pt-8 border-t">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
