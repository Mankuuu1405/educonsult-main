import React from 'react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16 max-w-4xl">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-primary leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-3xl mx-auto">
            Last Updated: August 16, 2025
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-card border border-border-color/60 p-6 sm:p-8 lg:p-10 space-y-8 text-text-primary font-sans">
          <p>
            Welcome to CeTutor! This Privacy Policy describes how CeTutor ("we," "us," or "our") collects, uses, and discloses your information when you use our website, services, and applications (collectively, the "Service").
          </p>
          <p>
            By accessing or using our Service, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with the terms of this policy, please do not access or use the Service.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              1. Information We Collect
            </h2>
            <p>
              We collect various types of information to provide and improve our Service to you.
            </p>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-6">
              1.1. Information You Provide to Us
            </h3>
            <p>
              When you register for an account, create a profile, use our services, or communicate with us, you may provide us with the following types of personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <span className="font-semibold">Account Information:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li><span className="font-semibold">For Students:</span> Your full name, email address, password, academic institution, area of study, educational level, and other relevant academic interests.</li>
                  <li><span className="font-semibold">For Mentors (Professors):</span> Your full name, university email, password, primary area of expertise, university affiliation, academic credentials (e.g., degree, publications), professional experience, and potentially background check information (if applicable to our vetting process).</li>
                </ul>
              </li>
              <li><span className="font-semibold">Profile Information:</span> Information you choose to provide for your public profile, such as a profile picture (avatar), a bio or "about" section, specialties, languages spoken, services offered, and pricing.</li>
              <li><span className="font-semibold">Communication Content:</span> Messages, chats, and any information exchanged during live chat or video sessions, including session transcripts.</li>
              <li><span className="font-semibold">Feedback and Reviews:</span> Information you provide when you leave reviews, testimonials, or participate in surveys.</li>
              <li><span className="font-semibold">Support Interactions:</span> Information you provide when contacting our customer support, including the content of your communications.</li>
              <li><span className="font-semibold">Payment Information:</span> While we do not directly store your full payment card details, our third-party payment processor ([e.g., Stripe, PayPal, or the name of your processor]) may collect and process your payment information, including card number, billing address, and transaction details. We receive confirmation of payment from our processor but do not have direct access to your sensitive financial data.</li>
            </ul>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-6">
              1.2. Information We Collect Automatically
            </h3>
            <p>
              When you access and use our Service, we may automatically collect certain information about your device and usage:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Log Data:</span> Information that your browser sends whenever you visit our Service, such as your IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</li>
              <li><span className="font-semibold">Device Information:</span> Information about the device you use to access our Service, including hardware model, operating system, unique device identifiers, and mobile network information.</li>
              <li>
                <span className="font-semibold">Cookies and Tracking Technologies:</span> We use cookies and similar tracking technologies (like web beacons and pixels) to track activity on our Service and hold certain information. Cookies are small data files stored on your device. We use them for:
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li><span className="font-semibold">Essential functionality:</span> Remembering your login status, preferences.</li>
                  <li><span className="font-semibold">Performance analysis:</span> Understanding how the Service is used to improve it.</li>
                  <li><span className="font-semibold">Personalization:</span> Tailoring your experience on the Service.</li>
                </ul>
                <p className="mt-2">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
              </li>
              <li><span className="font-semibold">Usage Details:</span> Information about how you interact with our Service, such as the features you use, the content you view, the searches you perform, and the links you click.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <span className="font-semibold">To Provide and Maintain the Service:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>To register and manage your account.</li>
                  <li>To create and maintain your user profile (student or mentor).</li>
                  <li>To facilitate connections and matching between students and mentors.</li>
                  <li>To enable live chat, video sessions, and other communication features.</li>
                  <li>To process your transactions and payments.</li>
                  <li>To provide customer support and respond to your inquiries.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">To Improve and Personalize the Service:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>To understand how users interact with the Service and identify areas for improvement.</li>
                  <li>To personalize content and recommendations based on your interests and past activities.</li>
                  <li>To develop new features, products, and services.</li>
                  <li>To conduct research and analytics.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">For Communication:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>To send you service-related notifications, such as updates, security alerts, and administrative messages.</li>
                  <li>To send you promotional communications about new features, offers, or events that may be of interest to you (you can opt out of these).</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">For Security and Fraud Prevention:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>To detect, prevent, and address technical issues, security incidents, and fraudulent activities.</li>
                  <li>To enforce our Terms of Service and other policies.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">For Legal Compliance:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>To comply with legal obligations, requests from public authorities, and court orders.</li>
                  <li>To establish, exercise, or defend legal claims.</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              3. How We Share Your Information
            </h2>
            <p>
              We may share your information with third parties in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <span className="font-semibold">With Other Users:</span>
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li><span className="font-semibold">For Mentors:</span> Your public profile information (name, avatar, university, specialty, rating, reviews, services, about section, expertise tags) will be visible to other users (students) to facilitate discovery and connection.</li>
                  <li><span className="font-semibold">For Students:</span> When you connect with a mentor, your name and academic interests may be shared with that specific mentor to facilitate the session. Your reviews will also be associated with your name (or chosen display name) on the mentor's profile.</li>
                </ul>
              </li>
              <li><span className="font-semibold">With Service Providers:</span> We engage trusted third-party companies and individuals to perform services on our behalf and to assist us in operating and improving the Service. These may include:
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>Payment processors (e.g., Stripe, PayPal).</li>
                  <li>Hosting and cloud service providers (e.g., AWS, Google Cloud).</li>
                  <li>Analytics providers (e.g., Google Analytics).</li>
                  <li>Customer support providers.</li>
                  <li>Communication platforms.</li>
                </ul>
                <p className="mt-2">These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
              </li>
              <li><span className="font-semibold">For Business Transfers:</span> If we are involved in a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction. We will provide notice before your personal information is transferred and becomes subject to a different Privacy Policy.</li>
              <li><span className="font-semibold">For Legal Reasons:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency). We may also disclose your information in good faith belief that such action is necessary to:
                <ul className="list-circle list-inside ml-6 space-y-1 mt-1">
                  <li>Comply with a legal obligation.</li>
                  <li>Protect and defend the rights or property of CeTutor.</li>
                  <li>Prevent or investigate possible wrongdoing in connection with the Service.</li>
                  <li>Protect the personal safety of users of the Service or the public.</li>
                  <li>Protect against legal liability.</li>
                </ul>
              </li>
              <li><span className="font-semibold">With Your Consent:</span> We may disclose your personal information for any other purpose with your explicit consent.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              4. Your Data Protection Rights
            </h2>
            <p>
              Depending on your location and applicable laws, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">Right to Access:</span> You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
              <li><span className="font-semibold">Right to Rectification:</span> You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
              <li><span className="font-semibold">Right to Erasure (Right to be Forgotten):</span> You have the right to request that we erase your personal data, under certain conditions.</li>
              <li><span className="font-semibold">Right to Restrict Processing:</span> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              <li><span className="font-semibold">Right to Object to Processing:</span> You have the right to object to our processing of your personal data, under certain conditions.</li>
              <li><span className="font-semibold">Right to Data Portability:</span> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              <li><span className="font-semibold">Right to Withdraw Consent:</span> Where we rely on your consent to process your personal information, you have the right to withdraw that consent at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:[your support email, e.g., support@CeTutor.com]" className="text-accent hover:underline">[your support email, e.g., support@CeTutor.com]</a>. We will respond to your request within [e.g., 30 days] of receiving it.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              5. Data Security
            </h2>
            <p>
              The security of your data is important to us. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. These measures include using industry-standard encryption for data in transit (e.g., SSL/TLS) and at rest, regular security audits, and access controls.
            </p>
            <p>
              However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              6. Data Retention
            </h2>
            <p>
              We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, typically for the duration of your account and for a reasonable period thereafter as required or permitted by law (e.g., for legal, accounting, or reporting requirements).
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              7. Children's Privacy
            </h2>
            <p>
              Our Service is not intended for use by individuals under the age of <span className="font-semibold">[e.g., 13 or 16, depending on your target audience and legal jurisdiction, e.g., for COPPA 13, for GDPR 16]</span>. We do not knowingly collect personally identifiable information from anyone under that age. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              8. Third-Party Links
            </h2>
            <p>
              Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. We may also notify you via email or through a prominent notice on our Service prior to the change becoming effective.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary pt-4 border-t border-border-color/50">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, our data practices, or your rights, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="font-semibold">By Email:</span> <a href="mailto:[your support email, e.g., support@CeTutor.com]" className="text-accent hover:underline">[your support email, e.g., support@CeTutor.com]</a></li>
              <li><span className="font-semibold">By Visiting this page on our website:</span> <a href="[Link to your contact page, e.g., /contact]" className="text-accent hover:underline">[Link to your contact page, e.g., /contact]</a></li>
              <li>
                <span className="font-semibold">By Mail (Optional, if you have a physical address for legal/privacy inquiries):</span>
                <ul className="list-none ml-6 space-y-1 mt-1">
                  <li>[Your Company Name]</li>
                  <li>[Your Company Address]</li>
                  <li>[City, Postal Code]</li>
                  <li>[Country]</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;