import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react';

const Privacycontent = (props) => {
  const { onArrowPress } = props;
  const { ref } = useFocusable({ onArrowPress });

  return (
    <div ref={ref} className="content" style={{ lineHeight: '1.6', fontFamily: 'euclid-regular' }}>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic', marginBottom: '15px' }}>
        Last updated: April 15, 2026 | Effective Date: April 15, 2026 | Governed by laws of India
      </p>
      <p>
        We, <span style={{ color: '#fff', fontWeight: '600' }}>Odisha Television Limited</span> ("we", "us", "our", or "Company"), value the trust placed in us by You and therefore follow the highest standards of privacy guidelines to protect the information shared by You with us. This Privacy Policy ("Privacy Policy") governs the use of Personal Information shared with or collected by Odisha Television Limited from users or subscribers of <span style={{ color: '#fff', fontWeight: '600' }}>Tarang Plus</span>, accessible at <span style={{ color: '#fff', fontWeight: '600' }}>tarangplus.in</span>.
      </p>
      <p>
        This Privacy Policy is compliant with the Information Technology Act, 2000 (as amended), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules"), the Information Technology (Intermediaries Guidelines) Rules, 2011, and the Digital Personal Data Protection Act, 2023 ("DPDP Act"), as applicable.
      </p>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Your consent: </span>
        Your viewing, browsing, or use of Tarang Plus and our services constitutes Your consent to our collection, storage, processing, and transfer of Your Personal Information or Sensitive Personal Data or Information in accordance with this Privacy Policy. If You do not agree with the terms herein, please do not download, browse, or use Tarang Plus. This Privacy Policy should be read in conjunction with our Terms and Conditions. All capitalised terms not defined herein shall have the same meaning as in the Terms of Use.
      </p>

      <h3 className="sub-title">Table of Contents</h3>
      <ol style={{ paddingLeft: '24px', margin: '15px 0 25px 0', color: 'rgba(255, 255, 255, 0.85)' }}>
        <li>Definitions</li>
        <li>Information We Collect</li>
        <li>Inferred Information Through Usage and Log Data</li>
        <li>Cookies and Tracking Technologies</li>
        <li>Payment Information and Gateways</li>
        <li>Social Login and Third-Party Services</li>
        <li>User Consent</li>
        <li>How We Use Your Information</li>
        <li>Legal Basis for Processing</li>
        <li>Sharing and Disclosure of Information</li>
        <li>Third-Party Sites</li>
        <li>Promotional and Marketing Communications</li>
        <li>Data Retention</li>
        <li>Deleting Your Information</li>
        <li>Data Security and Compliance</li>
        <li>Your Rights</li>
        <li>Children's Privacy</li>
        <li>Amendments</li>
        <li>Grievance Officer</li>
        <li>Contact Us</li>
      </ol>

      <h3 className="sub-title">1. Definitions</h3>
      <p>
        'Personal Information', 'Information', and 'Sensitive Personal Data or Information' shall have the meaning ascribed to them under applicable laws in India, including the IT Act, 2000, SPDI Rules, 2011, and the DPDP Act, 2023. For ease of reference:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Personal Information: </span>
          means any information that can be used to identify an individual, directly or indirectly, including name, email address, mobile number, and similar identifiers.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Sensitive Personal Data or Information (SPDI): </span>
          means personal information relating to passwords, financial information, health data, biometric data, and similar categories as defined under applicable Indian law.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Non-Personal Information: </span>
          means aggregated, anonymised, or de-identified data that cannot be used to identify any individual.
        </li>
      </ul>

      <h3 className="sub-title">2. Information We Collect</h3>
      <p>
        We collect information directly provided by You, Your usage and log data, and data collected through cookies and similar technologies. Specifically, we collect the following categories of information when You use or browse Tarang Plus, at the time of registration, and when You share information with us through email, customer care, or any other means made available by us:
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #707070' }}>
            <th style={{ padding: '8px 12px', color: '#fff', width: '30%' }}>Category</th>
            <th style={{ padding: '8px 12px', color: '#fff' }}>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Personal Identification</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Full name, email address, mobile number, date of birth, gender</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Account Credentials</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Username (mobile number), password (stored in encrypted form)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Payment Information</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Transaction ID, payment method type (UPI, card, wallet); we do not directly store card or UPI numbers — see Section 5</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Device and Technical Data</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>IP address, device type, operating system, browser type and version, app version, unique device identifiers, network information</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Usage and Behavioural Data</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Content viewed, watch history, search queries, time spent, content preferences, referral source (platform visited before/after Tarang Plus)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Location Data</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Approximate location (city/state level) derived from IP address</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Survey and Feedback Data</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Responses to optional online surveys, contact information and demographic data provided during surveys</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Communications</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Messages sent to our support team, emails, letters, feedback, and messages posted on boards or social media connected to Tarang Plus</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>Social Login Data</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>If You log in via Google, Facebook, or other third-party services: user ID, username, public profile information, email address, and other authorised data — see Section 6</td>
          </tr>
        </tbody>
      </table>
      <p>
        Except as provided herein, we do not solicit any Sensitive Personal Data or Information from You. However, if You voluntarily share such information with us, we will not be liable for any actions, claims, costs, expenses, or liabilities arising from any unauthorised use or misuse of such information.
      </p>

      <h3 className="sub-title">3. Inferred Information Through Usage and Log Data</h3>
      <p>
        We may track certain information about You based upon Your behaviour, usage patterns, and preferences on Tarang Plus. We use this information to conduct internal research on our users' demographics, devices, interests, and behaviour to better understand, protect, and serve our users. This information is compiled and analysed on an aggregated basis and may include:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>The platform You visited before and after Tarang Plus.</li>
        <li>Your computer or device browser information.</li>
        <li>Traffic patterns and network behaviour on our platform.</li>
      </ul>
      <p>We may also use Your information to:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Evaluate Your interest in various genres of content, services, and offers.</li>
        <li>Perform analytics and conduct customer research to determine interests and identify content that drives engagement.</li>
        <li>Analyse traffic patterns across our network and applications.</li>
        <li>Understand and analyse demographic trends to administer and improve our services.</li>
        <li>Tailor Your experience and display content according to Your preferences.</li>
      </ul>
      <p>
        We identify and use Your IP address to help diagnose server issues, administer Tarang Plus, and gather broad demographic information to customise Your experience. As Non-Personal Information does not personally identify You, we may use and disclose Non-Personal Information at our discretion.
      </p>
      <p>
        If You send us personal correspondence such as emails or letters, or if other users or third parties send us correspondence about Your activities or postings on Tarang Plus, we may collect and store such information to resolve disputes, provide customer support, and troubleshoot problems as permitted by law.
      </p>

      <h3 className="sub-title">4. Cookies and Tracking Technologies</h3>
      <p>
        A "cookie" is a small piece of information stored by a web server on a web browser so it can be later read back from that browser. Cookies are useful for enabling the browser to remember information specific to a given user. We place both permanent and temporary cookies on Your device. The cookies do not contain any of Your personally identifiable information on their own.
      </p>
      <p>We use cookies, web beacons, and similar tracking technologies on Tarang Plus. These may include:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Essential cookies: </span> Required for the platform to function correctly, including login sessions and user preferences.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Analytics cookies: </span> To understand how users interact with the platform, analyse traffic, and improve our services.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Marketing cookies: </span> To serve relevant advertisements and promotional content (if applicable).</li>
      </ul>
      <p>
        We may combine Your Personal Information or Sensitive Personal Data or Information with information collected from tracking technologies and aggregate it with information collected from other users to attempt to provide You with a better experience on Tarang Plus.
      </p>
      <p>
        You may manage cookie preferences through Your browser settings. Disabling certain cookies may affect the functionality of the platform.
      </p>

      <h3 className="sub-title">5. Payment Information and Third-Party Payment Gateways</h3>
      <p>
        Tarang Plus uses third-party payment gateway providers to process and facilitate the payment of Your Subscription Fee. Please note that <span style={{ color: '#fff', fontWeight: '600' }}>Odisha Television Limited does not directly collect any financial information</span> such as credit card, debit card, or net banking details from You. Such financial information is collected and stored by our payment gateway partners.
      </p>
      <p>
        When You visit such payment gateways, You do so at Your own risk. These payment gateways may have their own privacy policies in place, which we recommend You review prior to providing information or entering into any transactions with them. We do not assume any responsibility or liability for such payment gateways, their content, or their privacy practices, nor do we endorse them.
      </p>
      <p>You understand, agree, and acknowledge that:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Tarang Plus never directly receives Your financial or payment information (credit/debit card numbers, net banking credentials, UPI handles) from these gateways.</li>
        <li>Your Personal Information, Sensitive Personal Data or Information, and financial information will be dealt with by payment gateways in accordance with their respective privacy policies and terms.</li>
        <li>Odisha Television Limited shall not be liable, accountable, or responsible for Your financial information which You provide to such payment gateways.</li>
        <li>Information stored by our payment gateway partners may include transaction IDs and payment method types (e.g., UPI, card, wallet) which we receive solely for subscription management and support purposes.</li>
      </ul>

      <h3 className="sub-title">6. Social Login and Third-Party Service Integration</h3>
      <p>
        If You choose to log in, access, or otherwise connect to Tarang Plus through a third-party service (such as Google, Facebook, or similar platforms), we may collect:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Your user ID and username associated with that service.</li>
        <li>Any information You have made public using that service.</li>
        <li>Information You have authorised the service to share with us, such as Your user ID, billing information, public profile information, email address, date of birth, and other account and profile data.</li>
      </ul>
      <p>
        The collection and use of information by such third-party services is governed by their own privacy policies, which we encourage You to review.
      </p>

      <h3 className="sub-title">7. User Consent</h3>
      <p>
        You expressly understand, agree, and acknowledge that our collection, storage, and processing of Your Personal Information or Sensitive Personal Data or Information is for a lawful purpose connected with a function or activity of the Tarang Plus platform. You hereby consent to the collection, storage, use, disclosure, and transfer of Your Personal Information or Sensitive Personal Data or Information by Tarang Plus or Odisha Television Limited for the purposes set out in this Privacy Policy.
      </p>
      <p>
        You further understand, agree, and acknowledge that Your Personal Information, which is classified as Sensitive Personal Data or Information as per applicable laws, is considered necessary for Tarang Plus to provide various services on its platform to You, and for Your usage of the platform and other services provided by Tarang Plus. You affirmatively give consent to Tarang Plus for collecting, storing, transferring, and processing Your Personal Information for these purposes.
      </p>
      <p>
        You also expressly provide Your consent to us for sharing Your Personal Information with third parties for marketing and advertising purposes, as described in Section 10 of this Privacy Policy.
      </p>

      <h3 className="sub-title">8. How We Use Your Information</h3>
      <p>
        We collect and use Your Personal Information to provide You with a safe, efficient, smooth, and customised experience on Tarang Plus. Specifically, we use Your information for the following purposes:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>To create, manage, authenticate, and administer Your account on Tarang Plus.</li>
        <li>To process subscription payments and manage recurring mandates including UPI AutoPay.</li>
        <li>To personalise Your content recommendations and overall viewing experience.</li>
        <li>To send transactional communications such as payment receipts, subscription renewal alerts, and service notifications.</li>
        <li>To send promotional and marketing communications (You may opt out at any time — see Section 12).</li>
        <li>To evaluate Your interest in various genres, content, services, and offers.</li>
        <li>To detect, prevent, investigate, and address fraud, security issues, and technical problems.</li>
        <li>To comply with legal obligations and regulatory requirements under Indian law.</li>
        <li>To analyse usage patterns, conduct customer research, and improve our platform.</li>
        <li>To administer contests, games, or activities conducted by Odisha Television Limited.</li>
        <li>To resolve disputes and provide customer support.</li>
      </ul>

      <h3 className="sub-title">9. Legal Basis for Processing</h3>
      <p>We process Your personal data on the following legal bases, as applicable under Indian law:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Consent: </span> For marketing communications, cookies, Sensitive Personal Data or Information processing, and sharing with third parties for advertising purposes.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Contract: </span> For processing subscription payments and managing Your account as necessary to deliver the services You have subscribed to.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Legitimate Interest: </span> For improving our platform, fraud prevention, security, and internal analytics, where such interest does not override Your rights.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Legal Obligation: </span> For compliance with applicable Indian laws, court orders, and regulatory requirements.</li>
      </ul>

      <h3 className="sub-title">10. Sharing and Disclosure of Information</h3>
      <p>
        We do not sell Your personal information. We may disclose or share Your Personal Information or Sensitive Personal Data or Information with the following categories of recipients, strictly on confidential terms:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Affiliates and group companies of Odisha Television Limited: </span> For operational, administrative, and promotional purposes.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Payment processors and banking partners: </span> To facilitate subscription transactions and UPI AutoPay mandates.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Technology service providers: </span> For hosting, analytics, content delivery, customer support tools, and platform operations, under strict data processing agreements and contractual confidentiality obligations.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Marketing and advertising partners: </span> With Your express consent, for marketing and advertising purposes. Third parties engaged for this purpose are under a contractual obligation to protect Your data in accordance with the same standard that Odisha Television Limited is subject to under this Privacy Policy.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Legal and regulatory authorities: </span> In the event of a requirement by court order, government or quasi-government agency, or any other legal process requiring us to disclose Your Personal Information. We may also disclose Your information if we, in good faith, believe such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process, or to protect our rights, users' rights, partners' rights, privacy, safety, or property.</li>
      </ul>
      <p>
        Recipients of Your Personal Information or Sensitive Personal Data may be located outside India. This may include countries where applicable data protection laws provide a lesser degree of protection than India. You expressly consent to such transfer of Your Personal Information and Sensitive Personal Data.
      </p>
      <p>
        We shall endeavour that all third parties and agents to whom we provide access to Your Personal Information or Sensitive Personal Data are under a contractual obligation to protect Your information in accordance with the same standards set out in this Privacy Policy.
      </p>

      <h3 className="sub-title">11. Third-Party Sites</h3>
      <p>
        Tarang Plus may provide links to various third-party websites that may collect Your Personal Information. Use of Your information collected by such third-party platforms will be governed by the privacy policies of those platforms. Odisha Television Limited has no control over the operation of such third-party websites. You may share information with such third parties at Your sole risk, and Odisha Television Limited shall not be liable to You for any misappropriation of Your Personal Information by such third parties.
      </p>

      <h3 className="sub-title">12. Promotional and Marketing Communications</h3>
      <p>
        By accessing Tarang Plus, You expressly consent to receive promotional and marketing communications from us at regular intervals. We will send communications through various modes including SMS, in-app messages, push notifications, and email to notify You of, among other things, various offers, new content, exclusive deals, and new services that may be available.
      </p>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Opt-out: </span>
        If You do not wish to receive any promotional communication from us, You may unsubscribe at any time by sending an email to <span style={{ color: '#fff', fontWeight: '600' }}>tarangplus@odishatv.in</span> with the subject line "Unsubscribe". Please allow up to 7 business days for Your request to be processed. Note that opting out of marketing communications will not affect transactional or service communications which are necessary for Your subscription.
      </p>

      <h3 className="sub-title">13. Data Retention</h3>
      <p>
        We retain Your Personal Information or Sensitive Personal Data or Information only for as long as we believe it to be necessary for the purposes set out in this Privacy Policy for which the information was collected, subject to any legal requirements for data to be retained for longer periods. For financial records and tax compliance obligations, we may retain relevant data for up to 5 years post-account deletion, as required by applicable Indian law.
      </p>

      <h3 className="sub-title">14. Deleting Your Information</h3>
      <p>
        If You wish to have the Personal Information or Sensitive Personal Data or Information that You have provided to us deleted, You may do so at any time by sending a request to <span style={{ color: '#fff', fontWeight: '600' }}>tarangplus@odishatv.in</span> with the subject line "Data Deletion Request".
      </p>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Please note: </span>
        Deletion of certain Personal Information may lead to cancellation of Your registration with Tarang Plus, restriction of access to certain features, or a complete cessation of Your access to the Tarang Plus platform or application. Certain data may also be retained by us for legal, audit, or regulatory compliance purposes even after a deletion request.
      </p>

      <h3 className="sub-title">15. Data Security and Compliance</h3>
      <p>
        We strive to protect Your Personal Information against unauthorised disclosure, misuse, unlawful use, modification, loss, or destruction. We take all reasonable measures and precautions, as per standard industry practices, to keep Your Personal Information confidential and ensure compliance with all applicable laws.
      </p>
      <p>
        Specifically, we use reasonable administrative, logical, physical, and managerial measures to safeguard Your personal information against loss, theft, and unauthorised access, use, and modification, including:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Encryption of data in transit (TLS/SSL) and at rest where applicable.</li>
        <li>Strict access controls and authentication mechanisms.</li>
        <li>Regular security audits and vulnerability assessments.</li>
        <li>Appropriate steps for the security and protection of all digital platforms including internal applications.</li>
      </ul>
      <p>
        However, we shall not be responsible for any breach of security or disclosure of Personal Information for reasons outside our control, including hacking, social engineering, cyber terrorism, espionage by third parties, or any Force Majeure events such as sabotage, fire, flood, explosion, acts of God, civil commotion, strikes or industrial action, riots, insurrection, war, or acts of government.
      </p>
      <p>
        Unfortunately, no security measures can be guaranteed to provide 100% protection. Accordingly, we cannot guarantee the security of Your information. By continuing to access Tarang Plus, You acknowledge and accept this inherent risk.
      </p>

      <h3 className="sub-title">16. Your Rights as a Data Principal</h3>
      <p>
        As a data principal under applicable Indian law, including the DPDP Act, 2023, You have the following rights with respect to Your personal data held by Odisha Television Limited:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Right to Access: </span> Access and review the Personal Information we hold about You.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Right to Correction: </span> Request correction of inaccurate or incomplete Personal Information.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Right to Erasure: </span> Request deletion of Your Personal Information, subject to legal and regulatory obligations (see Section 14).</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Right to Withdraw Consent: </span> Withdraw consent for marketing communications or non-essential data processing at any time.</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Right to Grievance Redressal: </span> Lodge a grievance with our Grievance Officer (see Section 19).</li>
      </ul>
      <p>
        To exercise any of the above rights, please contact us at <span style={{ color: '#fff', fontWeight: '600' }}>tarangplus@odishatv.in</span>. We will respond to Your request within 30 days of receipt.
      </p>

      <h3 className="sub-title">17. Children's Privacy</h3>
      <p>
        The Tarang Plus platform is not directed to children under the age of 13. We do not knowingly collect Personal Information from children under 13 years of age. If You are a parent or guardian and believe that a child under 13 has provided us with Personal Information, please contact us at <span style={{ color: '#fff', fontWeight: '600' }}>tarangplus@odishatv.in</span> and we will take prompt steps to delete such information from our records.
      </p>

      <h3 className="sub-title">18. Amendments to This Policy</h3>
      <p>
        This Privacy Policy is subject to change from time to time. We reserve the right, at our sole discretion, to modify the terms of this Privacy Policy from time to time in order to ensure compliance with applicable laws ("Updated Terms"). The Updated Terms shall be effective immediately and shall supersede the prior terms of this Privacy Policy.
      </p>
      <p>
        We shall not be under an obligation to notify You of any changes to this Privacy Policy. You are solely responsible for reviewing this Privacy Policy from time to time for any modifications. By continuing to use Tarang Plus after the Updated Terms have been published, You affirm Your agreement to the Updated Terms.
      </p>

      <h3 className="sub-title">19. Grievance Officer</h3>
      <p>
        In accordance with the Information Technology Act, 2000, the SPDI Rules, 2011, and applicable rules thereunder, the details of our designated Grievance Officer are set out below. Any grievance regarding the collection, storage, processing, or use of Your Personal Information or Sensitive Personal Data or Information should be addressed to:
      </p>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', margin: '15px 0' }}>
        <p style={{ margin: '4px 0 10px 0', color: '#fff', fontWeight: '600', fontSize: '1.05em' }}>
          Grievance Officer – Tarang Plus
        </p>
        <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.65)', fontSize: '0.9em', fontStyle: 'italic' }}>
          As required under the Information Technology Act, 2000 and IT Rules, 2011
        </p>
        <p style={{ margin: '4px 0' }}><span style={{ color: '#fff', fontWeight: '600' }}>Name: </span> Manoj Panigrahi</p>
        <p style={{ margin: '4px 0' }}><span style={{ color: '#fff', fontWeight: '600' }}>Designation: </span> Senior Manager, Compliance</p>
        <p style={{ margin: '4px 0' }}><span style={{ color: '#fff', fontWeight: '600' }}>Organisation: </span> Odisha Television Limited</p>
        <p style={{ margin: '4px 0' }}><span style={{ color: '#fff', fontWeight: '600' }}>Email: </span> tarangplus@odishatv.in</p>
        <p style={{ margin: '4px 0' }}><span style={{ color: '#fff', fontWeight: '600' }}>WhatsApp / Phone: </span> +91 – 7077710423</p>
        <p style={{ margin: '4px 0' }}><span style={{ color: '#fff', fontWeight: '600' }}>Address: </span> N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha 751024</p>
      </div>
      <p>
        Grievances will be acknowledged within 48 hours and resolved within 30 days of receipt.
      </p>

      <h3 className="sub-title">20. Contact Us</h3>
      <p>If You require any information or clarification regarding the use of Your Personal Information or this Privacy Policy, please contact us at:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Email: </span> tarangplus@odishatv.in</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Phone: </span> 7077710423</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Address: </span> N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha 751024</li>
      </ul>
      <p>
        Odisha Television Limited is a company based in India, registered under the Companies Act, 1956. By browsing or using Tarang Plus, You hereby acknowledge that Odisha Television Limited is not responsible or liable in any manner to comply with any local laws of Your territory outside India with respect to Tarang Plus.
      </p>
    </div>
  );
};

export default Privacycontent;