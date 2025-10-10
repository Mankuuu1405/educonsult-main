
import React from 'react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16 max-w-4xl">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-primary leading-tight">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-3xl mx-auto">
            Last Updated: August 16, 2025
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-card border border-border-color/60 p-6 sm:p-8 lg:p-10 space-y-8 text-text-primary font-sans">
          <p>
            Welcome to CeTutor! These Terms and Conditions ("Terms," "Agreement") govern your access to and use of the CeTutor website (the "Service") operated by [Your Company Name/Legal Entity Name] ("us," "we," or "our").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or by using any part of our Service, you confirm that you are at least [e.g., 18] years of age or the age of legal majority in your jurisdiction, whichever is greater, and that you understand and agree to be bound by these Terms. If you are under the age of legal majority, your parent or legal guardian must agree to these Terms on your behalf.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              2. Description of Service
            </h2>
            <p>
              CeTutor is an online platform that connects students seeking academic and professional guidance ("Students") with qualified mentors and experts ("Mentors" or "Professors"). The Service includes, but is not limited to, mentor profiles, search and filtering tools, a communication platform (live chat, video calls), scheduling tools, and payment processing for sessions.
            </p>
            <p>
              CeTutor acts as a marketplace and is not directly involved in the mentor-mentee relationship. We do not provide advice, tutoring, or mentorship services ourselves. We facilitate the connection between Students and Mentors, and our responsibility is limited to the functionality of the platform.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              3. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Registration:</span> To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
              <li><span className="font-semibold">Account Security:</span> You are responsible for safeguarding your password and for any activities or actions under your account. CeTutor cannot and will not be liable for any loss or damage arising from your failure to maintain the security of your account and password.</li>
              <li><span className="font-semibold">User Types:</span> The Service offers different account types (e.g., Student, Mentor), each with specific functionalities and requirements.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              4. Mentor Obligations (for Mentors/Professors)
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Accuracy of Information:</span> Mentors must provide accurate and verifiable information regarding their credentials, expertise, and experience. We reserve the right to verify information and may require additional documentation.</li>
              <li><span className="font-semibold">Professional Conduct:</span> Mentors agree to maintain a high level of professionalism, respect, and ethical conduct during all interactions with Students and CeTutor personnel.</li>
              <li><span className="font-semibold">Session Delivery:</span> Mentors are solely responsible for the quality, content, and delivery of their sessions.</li>
              <li><span className="font-semibold">Pricing & Availability:</span> Mentors are responsible for setting their own pricing and managing their availability on the platform.</li>
              <li><span className="font-semibold">Compliance:</span> Mentors must comply with all applicable laws and regulations in their jurisdiction related to their services.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              5. Student Obligations (for Students)
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Appropriate Use:</span> Students agree to use the Service for legitimate learning and guidance purposes only.</li>
              <li><span className="font-semibold">Respectful Conduct:</span> Students agree to interact with Mentors and CeTutor personnel in a respectful and professional manner.</li>
              <li><span className="font-semibold">Payment:</span> Students are responsible for timely payment for services rendered by Mentors through the platform.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              6. Payments, Fees, and Refunds
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Fees:</span> CeTutor charges a commission on transactions facilitated through the platform, as detailed on our <a href="/pricing" className="text-accent hover:underline font-semibold">Pricing Page</a>. These fees are deducted from the Mentor's earnings.</li>
              <li><span className="font-semibold">Payment Processing:</span> Payments are processed by third-party payment processors. You agree to be bound by their terms of service.</li>
              <li><span className="font-semibold">Refunds:</span> Refund policies for sessions are at the discretion of the Mentor, or as outlined in CeTutor's <a href="#" className="text-accent hover:underline font-semibold">Refund Policy</a> (if you have one, link here). Disputes will be handled on a case-by-case basis by CeTutor support.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              7. Intellectual Property
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Service Content:</span> All content, trademarks, service marks, trade names, logos, and other intellectual property on the Service (excluding User Content) are owned by or licensed to CeTutor and are protected by copyright, trademark, and other intellectual property laws.</li>
              <li><span className="font-semibold">User Content:</span> You retain all rights to any content you submit, post, or display on or through the Service ("User Content"). By submitting User Content, you grant CeTutor a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Service.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              8. Prohibited Conduct
            </h2>
            <p>
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Using the Service for any unlawful purpose or in violation of any international, federal, provincial or state regulations, rules, laws, or local ordinances.</li>
              <li>Soliciting others to perform or participate in any unlawful acts.</li>
              <li>Harassing, abusing, insulting, harming, defaming, slandering, disparaging, intimidating, or discriminating based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.</li>
              <li>Attempting to interfere with, compromise the system integrity or security or decipher any transmissions to or from the servers running the Service.</li>
              <li>Uploading or transmitting viruses or any other type of malicious code.</li>
              <li>Collecting or tracking the personal information of others.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              9. Termination
            </h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>

            <h2 className="2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              10. Disclaimers
            </h2>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. CeTutor MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.
            </p>
            <p>
              CeTutor DOES NOT ENDORSE ANY MENTOR OR STUDENT. WE DO NOT GUARANTEE THE QUALITY, CREDENTIALS, OR OUTCOME OF ANY SESSION OR INTERACTION BETWEEN USERS.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              11. Limitation of Liability
            </h2>
            <p>
              IN NO EVENT SHALL CeTutor, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              12. Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              13. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              14. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>By Email: <a href="/contact" className="text-accent hover:underline font-semibold">support@CeTutor.com</a></li>
              <li>By Visiting this page on our website: <a href="/" className="text-accent hover:underline font-semibold">www.CeTutor.com</a></li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;