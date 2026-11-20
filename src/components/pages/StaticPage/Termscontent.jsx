import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react';

const Termscontent = (props) => {
  const { onArrowPress } = props;
  const { ref } = useFocusable({ onArrowPress });

  return (
    <div ref={ref} className="content" style={{ lineHeight: '1.6', fontFamily: 'euclid-regular' }}>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic', marginBottom: '15px' }}>
        Last updated: April 15, 2026 | Effective Date: April 15, 2026 | Jurisdiction: Bhubaneswar, Odisha, India
      </p>
      <p style={{ color: '#fff', fontWeight: '600', marginBottom: '15px' }}>
        PLEASE READ THESE TERMS CAREFULLY BEFORE USING Hello Meghalaya.
      </p>

      <h3 className="sub-title">Table of Contents</h3>
      <ol style={{ paddingLeft: '24px', margin: '15px 0 25px 0', color: 'rgba(255, 255, 255, 0.85)' }}>
        <li>Introduction</li>
        <li>Definitions</li>
        <li>Eligibility</li>
        <li>Account Registration</li>
        <li>Your Responsibilities</li>
        <li>Subscription Plans and Payments</li>
        <li>UPI AutoPay and Recurring Mandates</li>
        <li>No Refund Policy</li>
        <li>Ownership and Intellectual Property</li>
        <li>Restrictions on Use</li>
        <li>User Generated Content and Feedback</li>
        <li>Reserved Rights Over Content</li>
        <li>Termination</li>
        <li>Force Majeure</li>
        <li>Warranty Disclaimer</li>
        <li>Indemnification</li>
        <li>Limitation of Liability</li>
        <li>International Use</li>
        <li>Confidentiality</li>
        <li>Assignment</li>
        <li>Electronic Communications</li>
        <li>Severability and Waiver</li>
        <li>Governing Law and Disputes</li>
        <li>Amendments to These Terms</li>
        <li>Privacy Policy Reference</li>
        <li>Contact Us</li>
      </ol>

      <h3 className="sub-title">1. Introduction</h3>
      <p>
        This application known as "Hello Meghalaya" ("Application") is made available by Odisha Television Limited and/or its affiliates ("Company", "We", "Us", or "Our"), having its registered office at N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha 751024.
      </p>
      <p>
        Hello Meghalaya, accessible at <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya.in</span>, is an Over-the-Top (OTT) streaming platform that provides Users with both free and subscription-based services, enabling access to entertainment content including movies, serials, Live TV, original series, and other audio-visual content streamed over the internet to compatible Devices.
      </p>
      <p>
        These Terms of Use ("Terms") are an electronic record in terms of the Information Technology Act, 2000 (as amended/re-enacted) ("IT Act") and rules thereunder, and are published in accordance with the Information Technology (Intermediaries Guidelines) Rules, 2011, which mandate publishing of rules and regulations, privacy policy, and terms of use for access to or usage of the Application.
      </p>
      <p>
        For the purpose of these Terms, "You", "Your", or "User" shall mean any person, natural or legal, who uses or browses Hello Meghalaya. "We", "Us", "Our" shall mean Odisha Television Limited.
      </p>

      <h3 className="sub-title">2. Definitions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #707070' }}>
            <th style={{ padding: '8px 12px', color: '#fff' }}>Term</th>
            <th style={{ padding: '8px 12px', color: '#fff' }}>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top', width: '25%' }}>"Application"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>The Hello Meghalaya application owned by Odisha Television Limited to provide Content on Devices, available on platforms such as iOS, Android, and supported web browsers.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Content"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>All text, graphics, images, music, software, audio, video, information, or any other materials available on Hello Meghalaya.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Devices"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Any and all internet-enabled devices such as smartphones, tablets, laptops, desktops, smart TVs, etc., compatible with and having access to the internet.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Hello Meghalaya"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>The Hello Meghalaya website (Hello Meghalaya.in), mobile web, mobile application, TV application, and any other future variations, domains, or means to offer the Services.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Subscription Package"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>A combination of one or multiple live TV channels, video on demand, TV shows, movies, or other content priced at a specific amount decided by Odisha Television Limited at its sole discretion.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Registered User"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>A User who has created an account on Hello Meghalaya.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Subscription User"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>A Registered User who has subscribed to a Subscription Package.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Internet"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>The system making use of TCP/IP software protocols, including all communication links (fixed, mobile, DSL, ISDN, UMTS, WiMax, or other broadband links) and any developments in such protocols.</td>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '8px 12px', color: '#fff', verticalAlign: 'top' }}>"Force Majeure Event"</td>
            <td style={{ padding: '8px 12px', verticalAlign: 'top' }}>Any event beyond the reasonable control of Odisha Television Limited as described in Clause 14.</td>
          </tr>
        </tbody>
      </table>

      <h3 className="sub-title">3. Eligibility</h3>
      <p>
        Unless otherwise specified, Hello Meghalaya is available for individuals who have attained the age of majority in their jurisdiction. In India, this service is restricted to Users who are 18 years of age or older. If You are under 18 years of age, You may access Hello Meghalaya only in accordance with applicable law and with the consent of Your parent or legal guardian.
      </p>
      <p>
        By browsing, downloading, installing, or using Hello Meghalaya, You represent and warrant that You are 18 years of age or older, or have obtained the requisite parental/guardian consent.
      </p>
      <p style={{ color: '#fff', fontWeight: '600' }}>
        Parental Advisory: Some content on Hello Meghalaya may not be suitable for all viewers. Parents and legal guardians are advised to exercise discretion before allowing children or wards to access content on this platform.
      </p>

      <h3 className="sub-title">4. Account Registration</h3>
      <p>
        You may register as a Registered User of Hello Meghalaya. During registration, You are required to create a username (using Your mobile number) and password. As a Registered User, You agree to:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Provide accurate, current, and complete information during and after registration, and update it as needed to keep it accurate and complete.</li>
        <li>Maintain the security and confidentiality of Your account credentials and password at all times.</li>
        <li>Not disclose Your password to any third party.</li>
        <li>Take sole responsibility for all activities or actions under Your account, whether or not You have authorised such activities.</li>
        <li>Immediately change Your password if You believe it has been compromised, and notify us at <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya@odishatv.in</span>.</li>
      </ul>
      <p>
        Odisha Television Limited reserves the right to suspend or terminate Your registration without assigning any reason, including in case of provision of inaccurate, outdated, or incomplete information. Odisha Television Limited will not be responsible for any financial loss, inconvenience, or mental agony resulting from misuse of Your username and password under any circumstances.
      </p>

      <h3 className="sub-title">5. Your Responsibilities</h3>
      <p>
        You are solely responsible for obtaining and maintaining the Device and internet connection needed to access and use Hello Meghalaya, and for paying all charges in relation thereto. Internet charges will depend on the plan subscribed by You from Your internet or mobile service provider.
      </p>
      <p>
        Hello Meghalaya is compatible with selected operating systems and specific Device versions. The download procedure of the Application is subject to the process specified by the operating system of Your Device. Odisha Television Limited shall not be responsible for:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Fluctuations in internet connection speed leading to corruption, delay, or defective download of the Application on Your Device.</li>
        <li>Your failure to upgrade Your Device following any Application update released by Odisha Television Limited.</li>
        <li>The performance or speed of data browsing, which is dependent on network usage patterns.</li>
      </ul>
      <p>
        The playback resolution or quality of Content will depend on a number of factors including the type of Device used and Your available bandwidth. If Odisha Television Limited detects that streamed content is being interrupted due to bandwidth issues, it may decrease the resolution and file size of streamed content in order to provide an uninterrupted viewing experience.
      </p>
      <p>
        Hello Meghalaya shall have the discretion to make certain or all Content available to You on either one or a limited number of end-user Devices concurrently. The Content on Hello Meghalaya is protected by copyright, trademark, patent, trade secret, and other laws and shall only be used as provided in these Terms, without the prior written permission of Odisha Television Limited.
      </p>

      <h3 className="sub-title">6. Subscription Plans and Payments</h3>
      <p>
        Hello Meghalaya provides both free access and subscription-based access to content. Some content is only available to Subscription Users. As a Subscription User, You will be required to subscribe to Subscription Packages made available by Odisha Television Limited from time to time.
      </p>
      <p>Current Subscription Packages include:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Monthly Plan – ₹49 + applicable taxes: </span>
          Billed every 30 days from the date of activation. Full access to all content in the Hello Meghalaya library including Live TV and on-demand content for the period.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Annual Full Premium Plan – ₹365 + applicable taxes: </span>
          Billed once for a 365-day subscription period. Full access to all content in the Hello Meghalaya library including Live TV, on-demand movies, serials, and original series for the period.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Annual Live Channels Plan – ₹150 + applicable taxes: </span>
          Billed once for a 365-day subscription period. Access to Live TV channels on the Hello Meghalaya platform for the period. On-demand content may not be included under this plan.
        </li>
      </ul>
      <p>
        All prices listed above are exclusive of applicable taxes. The final amount charged at checkout will include GST or any other applicable statutory levies as mandated by Indian law. Odisha Television Limited reserves the right to revise subscription prices at any time with prior notice to registered users.
      </p>
      <p>
        Payments may be made through credit card, debit card, net banking, UPI, cash card, or any other mode made available by Odisha Television Limited. In all such transactions, You must use Your own payment instruments and not those of any third party. All prices are subject to applicable taxes under Indian law.
      </p>
      <p>
        If You wish to continue using Hello Meghalaya after the expiry of a Subscription Package, You must renew or recharge Your account prior to expiry at the then-prevailing charges.
      </p>
      <p>
        Third-Party Payment Gateways: You may be directed to an external payment gateway page during checkout. Odisha Television Limited does not control such third-party websites and is not responsible for any transactions occurring on them. All grievances related to card fraud or payment disputes should be addressed to Your bank or payment instrument provider. Odisha Television Limited shall not be liable for any financial loss, inconvenience, or mental agony resulting from misuse of Your card or banking details.
      </p>

      <h3 className="sub-title">7. UPI AutoPay and Recurring Mandates</h3>
      <p>
        If You enrol in AutoPay via UPI or any other recurring payment mandate, the following terms apply:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>You authorise Odisha Television Limited to automatically debit Your designated payment method at each renewal cycle (monthly or annual) at the then-applicable subscription rate.</li>
        <li>You will receive advance notification before each renewal charge as mandated by applicable NPCI/RBI guidelines.</li>
        <li>You may cancel Your AutoPay mandate at any time before the next billing date through Your UPI application, Your bank, or by contacting our support team.</li>
        <li>Cancellation of AutoPay will prevent future automatic charges but will not generate a refund for the current billing period already paid.</li>
        <li>Your access to Hello Meghalaya will continue until the end of the current paid subscription period, regardless of AutoPay cancellation.</li>
      </ul>
      <p>
        How to cancel your UPI AutoPay mandate: Open your UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.) → Go to Manage Mandates / Recurring Payments → Find Hello Meghalaya / Odisha Television Limited → Cancel. Alternatively, contact your bank's customer care to revoke the standing instruction.
      </p>

      <h3 className="sub-title">8. No Refund Policy</h3>
      <p style={{ color: '#fff', fontWeight: '600' }}>
        All Subscription Fees paid to Hello Meghalaya are non-refundable, irrespective of whether the subscription has been availed by You or not.
      </p>
      <p>
        Any request for change or cancellation in any Subscription Package prior to the expiration of the current subscription period will not entitle You to a refund for any portion of the Subscription Fee paid for the unexpired period. Payments once made through any mode — credit card, debit card, net banking, UPI, cash card, or any other mode — shall not be refunded under any circumstances, except as provided below.
      </p>
      <p>Refunds may be considered only under the following exceptional circumstances, subject to investigation and approval:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Duplicate charge: </span>
          You were charged more than once for the same subscription period due to a payment system error.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Incorrect amount charged: </span>
          The amount debited differs from the displayed subscription price at the time of purchase.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Extended platform outage: </span>
          Hello Meghalaya was completely inaccessible for more than 72 continuous hours during Your active subscription, solely attributable to Odisha Television Limited, and not due to Your device, network, or third-party issues.
        </li>
      </ul>
      <p>
        Refund requests under these exceptions must be raised within 7 days of the charge or incident. Approved refunds will be processed to the original payment method within 7–10 business days.
      </p>

      <h3 className="sub-title">9. Ownership and Intellectual Property</h3>
      <p>
        All Content on Hello Meghalaya — including but not limited to videos, audio, images, graphics, logos, text, software — and the "Hello Meghalaya" word mark and design mark, as well as any other names, logos, and materials constituting trademarks, trade names, service marks, or logos ("Marks"), are owned by or licensed to Odisha Television Limited and are subject to copyright, trademark, patent, trade secret, and other intellectual property rights under Indian laws.
      </p>
      <p>
        You are granted a limited, personal, non-exclusive, non-transferable licence to access and stream Content solely for Your personal, non-commercial use. You agree not to:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Reproduce, duplicate, copy, download, stream-capture, archive, upload, publish, broadcast, sell, resell, modify, translate, decompile, disassemble, or reverse-engineer Hello Meghalaya or any portion thereof, including Content and Marks, except as authorised in writing by Odisha Television Limited.</li>
        <li>Create derivative works or materials derived from the Content or Marks, including montages, mash-ups, wallpapers, desktop themes, greeting cards, or merchandise.</li>
        <li>Remove, alter, interfere with, or circumvent any copyright notice, trademark, DRM mechanism, geo-filter, encryption, or other content protection or access control measure associated with the Content.</li>
        <li>Rent, lease, sublicense, assign, pledge, loan, or resell any Content of Hello Meghalaya.</li>
        <li>Transfer possession of any copy of Hello Meghalaya to another party (doing so will automatically terminate Your subscription).</li>
        <li>Permit any third party to benefit from the use or functionality of Hello Meghalaya, whether directly or via facility management, timesharing, service bureau, or any other arrangement.</li>
      </ul>
      <p>
        You hereby agree that all intellectual property rights, title, and interest in any user-generated content published or generated on Hello Meghalaya by You shall vest with Odisha Television Limited.
      </p>

      <h3 className="sub-title">10. Restrictions on Use</h3>
      <p>
        Hello Meghalaya is provided for Your personal, non-commercial use only. You agree not to use the Application for any commercial, unlawful, or prohibited purpose. Without limiting the foregoing, You shall not:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Use any deep-link, page-scrape, robot, spider, or other automatic device, program, algorithm, or methodology to access, acquire, copy, or monitor any portion of Hello Meghalaya or its Content.</li>
        <li>Probe, scan, or test the vulnerability of Hello Meghalaya or any network connected to it, or breach any security or authentication measures.</li>
        <li>Take any action that imposes an unreasonable or disproportionately large load on the infrastructure of Hello Meghalaya or any connected systems or networks.</li>
        <li>Forge headers or otherwise manipulate identifiers to disguise the origin of any message or transmittal sent to Odisha Television Limited on or through Hello Meghalaya.</li>
        <li>Impersonate any person or entity, or falsely represent Your identity or affiliation.</li>
        <li>Use technologies (including VPN or proxy services) to access content from territories where Odisha Television Limited does not have rights or does not offer services.</li>
        <li>Use Hello Meghalaya to promote services of competitors of Odisha Television Limited.</li>
        <li>Engage in advertising, solicitation of other users, or commercial activities (contests, sweepstakes, barter) without prior written consent from Odisha Television Limited.</li>
      </ul>
      <p>You shall not host, display, upload, modify, publish, transmit, update, or share any information that:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Belongs to another person and to which You have no right, or interferes with another user's use and enjoyment of Hello Meghalaya.</li>
        <li>Is harmful, harassing, defamatory, obscene, pornographic, invasive of privacy, hateful, ethnically objectionable, or unlawful in any manner, including but not limited to "indecent representation of women" within the meaning of the Indecent Representation of Women (Prohibition) Act, 1986.</li>
        <li>Is misleading, or promotes paedophilia, racism, bigotry, or physical harm against any group or individual.</li>
        <li>Involves unsolicited mass mailing, chain letters, or "spamming".</li>
        <li>Infringes upon intellectual property or privacy rights of any third party, including unauthorised disclosure of a person's name, email address, physical address, or phone number.</li>
        <li>Contains images or videos of another person without their express written consent, or the consent of their guardian in the case of a minor.</li>
        <li>Provides instructional information about illegal activities, including making or buying illegal weapons, or creating computer viruses.</li>
        <li>Threatens the unity, integrity, defence, security, or sovereignty of India, or incites the commission of any cognizable offence.</li>
        <li>Harms minors in any way.</li>
        <li>Contains restricted or password-only access pages, or hidden pages or images.</li>
        <li>Violates any law for the time being in force.</li>
      </ul>

      <h3 className="sub-title">11. User Generated Content and Feedback</h3>
      <p>
        Odisha Television Limited welcomes and encourages You to provide feedback, comments, and suggestions for improvements to Hello Meghalaya ("Feedback"). You may submit Feedback by emailing <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya@odishatv.in</span>.
      </p>
      <p>You acknowledge and agree that:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>All Feedback shall be the sole and exclusive property of Odisha Television Limited.</li>
        <li>You hereby irrevocably assign to Odisha Television Limited all Your right, title, and interest in and to all Feedback, including without limitation all worldwide patent rights, copyright rights, trade secret rights, and other proprietary or intellectual property rights therein.</li>
        <li>Odisha Television Limited shall not be under any obligation to act on Feedback provided by You and may, at its sole discretion, decide whether any action is required.</li>
        <li>You agree to indemnify and keep Odisha Television Limited harmless against any liabilities suffered or incurred as a consequence of any action taken pursuant to Your Feedback.</li>
      </ul>

      <h3 className="sub-title">12. Odisha Television Limited's Reserved Rights Over Content</h3>
      <p>
        Odisha Television Limited reserves the right to modify or discontinue Hello Meghalaya or any content therein at its sole discretion, with or without notice, without any liability to You or any third party. Specifically, Odisha Television Limited reserves the right, at any time, without notice and without liability, to:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Replace or otherwise withdraw any Subscription Package or Content.</li>
        <li>Change or reduce the number of hours of any Content available.</li>
        <li>Black out any Content.</li>
        <li>Modify the prices for Subscription Packages or any part of the Hello Meghalaya service.</li>
        <li>Change packaging and introduce base and add-on packages, or offer channels on an à-la-carte basis.</li>
      </ul>
      <p>
        You acknowledge and agree that Content provided as part of Hello Meghalaya is supplied by third parties and availability of such Content is outside Odisha Television Limited's control and may be removed at any time. Odisha Television Limited shall also have the right, but not the obligation, to refrain from providing any Content in the interest of national security, emergency, or war, or if such Content is anti-national, promotes political or religious propaganda, is against public policy, is banned under applicable law, or is otherwise objectionable, obscene, or derogatory to any person, class, or religious group.
      </p>

      <h3 className="sub-title">13. Termination</h3>
      <p>
        Your right to use Hello Meghalaya shall automatically terminate if You violate these Terms or any terms, rules, or guidelines published in connection with Hello Meghalaya. Odisha Television Limited reserves the right, in its sole discretion, to suspend or terminate Your access to all or any part of Hello Meghalaya at any time, with or without notice.
      </p>
      <p>
        As a Subscription User, Your right to use Hello Meghalaya shall automatically terminate on the expiry of the term of Your Subscription Package. You may discontinue Your use of and access to Hello Meghalaya at any time. You agree that upon suspension or termination, no amount shall be refunded to You by Odisha Television Limited.
      </p>

      <h3 className="sub-title">14. Force Majeure</h3>
      <p>
        Odisha Television Limited shall not be responsible or liable to You for any interruption, disruption, or deactivation of Hello Meghalaya on account of any Force Majeure Event. "Force Majeure Event" shall mean any event beyond the reasonable control of Odisha Television Limited, including but not limited to:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Acts of God (floods, earthquakes, storms, fire, etc.).</li>
        <li>Any act or omission of government or quasi-government agencies.</li>
        <li>Lock-out, strike, curfew, or civil unrest.</li>
        <li>Technical errors, network failures, or cyberattacks.</li>
        <li>War, hostilities, pandemic, or similar situations.</li>
      </ul>

      <h3 className="sub-title">15. Warranty Disclaimer</h3>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW OF INDIA, Hello Meghalaya IS PROVIDED ON AN "AS IS" BASIS WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WITHOUT LIMITING THE FOREGOING, YOU ASSUME SOLE RISK AND RESPONSIBILITY FOR SELECTING Hello Meghalaya TO ACHIEVE YOUR INTENDED RESULTS, AND SOLE RESPONSIBILITY FOR THE INSTALLATION OF, USE OF, AND RESULTS OBTAINED FROM Hello Meghalaya. ODISHA TELEVISION LIMITED MAKES NO WARRANTY THAT Hello Meghalaya WILL BE ERROR-FREE, VIRUS-FREE, OR FREE FROM INTERRUPTIONS OR OTHER FAILURES, OR THAT THE PLATFORM WILL SATISFY YOUR SPECIFIC REQUIREMENTS, OR THAT ERRORS WILL BE RECTIFIED. YOU UNDERSTAND THAT Hello Meghalaya CAN BE BLOCKED OR MADE INOPERABLE AND ODISHA TELEVISION LIMITED ASSUMES NO RESPONSIBILITY OR LIABILITY FOR THE SAME. Hello Meghalaya IS NOT DESIGNED OR INTENDED FOR USE IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE PERFORMANCE, INCLUDING WITHOUT LIMITATION NUCLEAR FACILITIES, AIRCRAFT NAVIGATION, AIR TRAFFIC CONTROL, WEAPONS SYSTEMS, OR LIFE-SUPPORT MACHINES. ODISHA TELEVISION LIMITED EXPRESSLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR SUCH HIGH-RISK ACTIVITIES.
      </p>

      <h3 className="sub-title">16. Indemnification</h3>
      <p>
        You agree to indemnify, defend, and hold harmless Odisha Television Limited, its subsidiaries, affiliates, officers, directors, employees, consultants, and agents ("Indemnified Parties") from and against any and all claims, liabilities, damages, losses, costs, expenses, and fees (including reasonable attorneys' fees) that such Indemnified Parties may incur as a result of or arising from:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>(a) Any information (including user-generated content, Feedback, or any other content) submitted, posted, or transmitted by You (or anyone using Your account) on or through Hello Meghalaya.</li>
        <li>(b) Your (or anyone using Your account's) use of Hello Meghalaya.</li>
        <li>(c) Your (or anyone using Your account's) violation of these Terms.</li>
        <li>(d) Your (or anyone using Your account's) violation of any rights of any other person or entity, including any copyright, patent, trademark, trade secret, or other proprietary rights.</li>
      </ul>
      <p>
        Odisha Television Limited reserves the right, at its own expense, to assume the exclusive defence and control of any matter subject to indemnification by You, in which event You will cooperate with Odisha Television Limited in asserting any available defences.
      </p>

      <h3 className="sub-title">17. Limitation of Liability</h3>
      <p>
        UNDER NO CIRCUMSTANCES AND UNDER NO LEGAL THEORY, WHETHER IN TORT, CONTRACT, OR OTHERWISE, SHALL ODISHA TELEVISION LIMITED BE LIABLE TO YOU OR ANY OTHER PERSON OR ENTITY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, REMOTE, OR CONSEQUENTIAL DAMAGES OR ANY OTHER DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, LOSS OF GOODWILL, LOSS OF CONFIDENTIAL OR OTHER INFORMATION, BUSINESS INTERRUPTION, WORK STOPPAGE, COMPUTER FAILURE OR MALFUNCTION, PERSONAL INJURY, LOSS OF PRIVACY, FAILURE TO MEET ANY DUTY OF GOOD FAITH OR REASONABLE CARE, NEGLIGENCE (WHETHER ACTIVE OR PASSIVE), OR ANY OTHER PECUNIARY OR OTHER LOSS ARISING OUT OF OR IN ANY WAY RELATED TO THE USE OR INABILITY TO USE Hello Meghalaya, LOSS OF DATA, OR OTHERWISE, UNDER OR IN CONNECTION WITH ANY PROVISION OF THESE TERMS — EVEN IF ODISHA TELEVISION LIMITED HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT WILL ODISHA TELEVISION LIMITED'S TOTAL LIABILITY TO YOU EXCEED THE AMOUNT OF YOUR LAST RECHARGE / SUBSCRIPTION PAYMENT MADE FOR Hello Meghalaya. THIS LIMITATION OF LIABILITY SHALL NOT APPLY TO LIABILITY FOR DEATH OR PERSONAL INJURY TO THE EXTENT THAT APPLICABLE LAW PROHIBITS SUCH LIMITATION. THE FOREGOING PROVISIONS SHALL BE ENFORCEABLE TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
      </p>

      <h3 className="sub-title">18. International Use</h3>
      <p>
        Odisha Television Limited is a company based in India. Hello Meghalaya is available in select countries only, limited by the content licensing rights granted to Odisha Television Limited. Using technologies — including VPN or proxy services — to access Content from territories where Odisha Television Limited does not have rights or does not offer services is strictly prohibited.
      </p>
      <p>
        By using Hello Meghalaya, You acknowledge that Odisha Television Limited is not responsible or liable to comply with any local laws of Your territory outside India with respect to Hello Meghalaya. You shall be solely liable for accessing and using Hello Meghalaya in the countries of Your use. Odisha Television Limited will not be held responsible for hindrances in access or use due to geographical change in Your location.
      </p>

      <h3 className="sub-title">19. Confidentiality</h3>
      <p>
        You agree that Hello Meghalaya — including but not limited to object code components provided to You — constitutes "Confidential Information" of Odisha Television Limited. You shall retain all Confidential Information in strict confidence, exercising at least the same diligence You exercise in preserving the secrecy of Your own most-valuable information, and in no event less than reasonable diligence.
      </p>

      <h3 className="sub-title">20. Assignment</h3>
      <p>
        These Terms are personal to You and You shall not assign, transfer, sub-contract, or otherwise part with these Terms or any right or obligation under them without Odisha Television Limited's prior written consent. Any attempt by You to assign or transfer these Terms without such written consent shall be null and of no effect.
      </p>
      <p>
        Odisha Television Limited may assign or transfer these Terms to any third party at its sole discretion and without restriction. Subject to the foregoing, these Terms will bind and inure to the benefit of the parties, their successors, personal representatives, and permitted assigns.
      </p>

      <h3 className="sub-title">21. Electronic Communications</h3>
      <p>
        When You use or send any data, information, or communication to Odisha Television Limited, You agree and understand that You are communicating through electronic records, and You consent to receive communications via electronic records from Odisha Television Limited periodically and as required. Odisha Television Limited will communicate with You by email, push notification, or other electronic means at the email address and/or mobile number available with us, which shall be deemed adequate service of notice/electronic record.
      </p>
      <p>
        Any notices required under these Terms should be sent by email to <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya@odishatv.in</span>. For notices made by email, the date of receipt will be deemed the date on which such notice is transmitted.
      </p>

      <h3 className="sub-title">22. Severability and Waiver</h3>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Severability: </span>
        If any provision of these Terms is deemed invalid, void, or unenforceable for any reason, that part will be deemed severable and will not affect the validity and enforceability of any remaining provisions.
      </p>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Waiver: </span>
        The failure of Odisha Television Limited to enforce or exercise at any time or for any period any term of or any right pursuant to these Terms shall not be construed as a waiver of any such right, and shall in no way affect Odisha Television Limited's right later to enforce or exercise it.
      </p>

      <h3 className="sub-title">23. Governing Law and Disputes</h3>
      <p>
        These Terms and all matters arising from them are governed by and construed in accordance with the laws of India. The courts of Bhubaneswar, Odisha, India shall have exclusive jurisdiction over all disputes arising in connection with these Terms.
      </p>
      <p>
        If You have any complaints with respect to any Content on Hello Meghalaya, please write to us at <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya@odishatv.in</span> with details of the objectionable content and Your details (name, mobile number, and such other details as may be requested). Odisha Television Limited will take reasonable measures to resolve the issue at its sole discretion. You agree that Odisha Television Limited shall under no circumstances be liable to You for any damages whatsoever, nor does Odisha Television Limited represent that any complaint will be resolved to Your satisfaction. The relationship between Odisha Television Limited and You is on a principal-to-principal basis; You are in no way Odisha Television Limited's legal representative, partner, or agent.
      </p>

      <h3 className="sub-title">24. Amendments to These Terms</h3>
      <p>
        Odisha Television Limited reserves the right, at its sole discretion, to modify these Terms from time to time ("Updated Terms"). Updated Terms shall be effective immediately and shall supersede prior Terms. You are solely responsible for reviewing these Terms periodically. By continuing to use Hello Meghalaya after Updated Terms have been published, You affirm Your agreement to the Updated Terms.
      </p>
      <p>
        These Terms expressly supersede and completely replace any and all prior Terms of Use. Odisha Television Limited shall not be bound by or liable to You for any pre-existing or contemporaneous written or oral representations or warranties made by anyone with respect to Hello Meghalaya, including any authorised agents, employees, or representatives.
      </p>

      <h3 className="sub-title">25. Privacy Policy</h3>
      <p>
        All information provided by You or collected by us shall be governed in accordance with the Privacy Policy located at <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya.in/privacy-policy</span>. By using Hello Meghalaya, You consent to the collection and use of Your personal data as described therein.
      </p>

      <h3 className="sub-title">26. Contact Us</h3>
      <p>If You have any questions about these Terms of Use, please contact Odisha Television Limited at:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Email: </span>Hello Meghalaya@odishatv.in</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Phone: </span>7077710423</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Address: </span>N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha 751024</li>
      </ul>
    </div>
  );
};

export default Termscontent;