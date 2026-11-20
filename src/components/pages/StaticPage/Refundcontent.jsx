import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react';

const Refundcontent = (props) => {
  const { onArrowPress } = props;
  const { ref } = useFocusable({ onArrowPress });

  return (
    <div ref={ref} className="content" style={{ lineHeight: '1.6', fontFamily: 'euclid-regular' }}>
      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic', marginBottom: '15px' }}>
        Last updated: April 15, 2026 | Effective Date: April 15, 2026 | Governed by laws of India | Jurisdiction: Bhubaneswar, Odisha
      </p>

      <p>
        This Cancellation and Refund Policy ("<span style={{ color: '#fff', fontWeight: '600' }}>Policy</span>") applies to all subscription plans purchased on the Hello Meghalaya platform operated by <span style={{ color: '#fff', fontWeight: '600' }}>Odisha Television Limited</span> ("<span style={{ color: '#fff', fontWeight: '600' }}>Company</span>", "we", "us", or "our"). Please read this Policy carefully before purchasing a subscription. By completing a purchase on Hello Meghalaya, You acknowledge that You have read, understood, and agree to be bound by the terms of this Policy.
      </p>

      <div style={{
        background: 'rgba(245, 132, 31, 0.12)',
        borderLeft: '4px solid #F5841F',
        padding: '14px 18px',
        margin: '20px 0',
        borderRadius: '0 8px 8px 0'
      }}>
        <p style={{ margin: 0 }}>
          <span style={{ color: '#F5841F', fontWeight: '700' }}>Important Notice: </span>
          All Subscription Fees paid to Hello Meghalaya are non-refundable irrespective of whether the subscription has been availed by You or not. Payments once made through any mode — credit card, debit card, net banking, UPI, cash card, or any other available mode — shall not be refunded under any circumstances, except as expressly provided in Section 5 of this Policy.
        </p>
      </div>

      <h3 className="sub-title">Table of Contents</h3>
      <ol style={{ paddingLeft: '24px', margin: '15px 0 25px 0', color: 'rgba(255, 255, 255, 0.85)' }}>
        <li>Subscription Plans and Activation</li>
        <li>No Refund Policy</li>
        <li>Payment Disputes and Financial Liability</li>
        <li>AutoPay and UPI Recurring Mandates</li>
        <li>Exceptions — When Refunds May Be Considered</li>
        <li>How to Request a Refund or Raise a Dispute</li>
        <li>Cancellation of Subscription (Without Refund)</li>
        <li>Termination and Suspension</li>
        <li>Changes to This Policy</li>
        <li>Contact Us</li>
      </ol>

      <h3 className="sub-title">1. Subscription Plans and Activation</h3>
      <p>Hello Meghalaya currently offers the following subscription plans:</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '600' }}>Plan</th>
            <th style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '600' }}>Price</th>
            <th style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '600' }}>Duration</th>
            <th style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '600' }}>Access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '500' }}>Monthly Plan</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>₹49 + applicable taxes</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>30 days from activation</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Full access to all Hello Meghalaya content including Live TV and on-demand</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '500' }}>Annual Full Premium Plan</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>₹365 + applicable taxes</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>365 days from activation</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Full access to all Hello Meghalaya content including Live TV, on-demand movies, serials, and original series</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: '500' }}>Annual Live Channels Plan</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>₹150 + applicable taxes</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>365 days from activation</td>
            <td style={{ padding: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>Access to Live TV channels on Hello Meghalaya. On-demand content may not be included under this plan.</td>
          </tr>
        </tbody>
      </table>

      <p>
        All prices listed are exclusive of applicable taxes. The final amount charged at checkout will include GST or any other applicable statutory levies as mandated by Indian law. Subscriptions are activated immediately upon successful payment processing. Access to the platform begins from the moment Your payment is confirmed.
      </p>

      <h3 className="sub-title">2. No Refund Policy</h3>
      <p>
        The Subscription Fees billed are non-refundable irrespective of whether the Subscription has been availed by You or not. All payments made for Hello Meghalaya subscriptions are final and non-refundable, except as expressly provided in Section 5 of this Policy. This applies to:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Monthly Plan subscription fees (₹49 + taxes)</li>
        <li>Annual Full Premium Plan subscription fees (₹365 + taxes)</li>
        <li>Annual Live Channels Plan subscription fees (₹150 + taxes)</li>
        <li>Any partial period remaining after account cancellation</li>
        <li>Subscriptions that were unused or partially used</li>
        <li>Subscriptions purchased during promotional or discounted periods</li>
      </ul>
      <p>
        Any request for change or cancellation in any Subscription plan prior to the expiration of the current Subscription plan period will not entitle You to a refund for any portion of the Subscription Fee paid for the unexpired period. We do not offer pro-rata or partial refunds for any unused portion of a subscription period.
      </p>

      <h3 className="sub-title">3. Payment Disputes and Financial Liability</h3>
      <p>
        Odisha Television Limited shall not be responsible for all or any dispute or difference relating to online payment made by You through credit card, debit card, net banking account, cash card, or via any other mode available. Odisha Television Limited will not be responsible for any financial loss, inconvenience, or mental agony resulting from misuse of Your credit card, debit card, net banking account number, cash card, or other payment details.
      </p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderLeft: '4px solid rgba(255, 255, 255, 0.4)',
        padding: '12px 16px',
        margin: '15px 0',
        borderRadius: '0 6px 6px 0'
      }}>
        <p style={{ margin: 0 }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Security Advisory: </span>
          You are advised to keep details of Your credit card, debit card, and net banking account strictly confidential and not share any such details with any third party. Odisha Television Limited shall bear no liability for any unauthorised transactions or fraud arising from disclosure of Your payment credentials.
        </p>
      </div>
      <p>
        In a credit card, debit card, net banking, or cash card transaction or via any other payment mode, You must use Your own payment instruments and not those belonging to a third party. You may be directed to an external payment gateway page during checkout. Odisha Television Limited does not control such third-party websites and is not responsible for any transactions occurring on them. All grievances related to card fraud or payment disputes must be addressed directly to Your bank, mobile carrier, or payment instrument provider.
      </p>

      <h3 className="sub-title">4. AutoPay and UPI Recurring Mandates</h3>
      <p>If You have enrolled in AutoPay via UPI or any other automatic payment mandate, the following terms apply:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Your subscription will auto-renew at the end of each billing cycle (monthly or annually) at the then-applicable price.</li>
        <li>You will receive a notification before each renewal charge as mandated by NPCI/RBI guidelines for recurring payment mandates.</li>
        <li>You may cancel Your AutoPay mandate at any time before the next billing date through Your UPI app, bank application, or by contacting our support team.</li>
        <li>Cancelling Your AutoPay mandate will prevent future automatic charges but will not generate a refund for the current billing period already paid.</li>
        <li>You will continue to have access to Hello Meghalaya until the end of Your current paid subscription period, regardless of AutoPay cancellation.</li>
      </ul>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>How to cancel your UPI AutoPay mandate: </span>
        Open your UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.) &gt; Go to Manage Mandates / Recurring Payments &rarr; Find Hello Meghalaya / Odisha Television Limited &rarr; Cancel the mandate. Alternatively, contact your bank's customer service directly to revoke the standing instruction. You may also write to us at <span style={{ color: '#F5841F' }}>Hello Meghalaya@odishatv.in</span> or call <span style={{ color: '#fff', fontWeight: '600' }}>7077710423</span> for assistance.
      </p>

      <h3 className="sub-title">5. Exceptions — When Refunds May Be Considered</h3>
      <p>
        Notwithstanding the general no-refund policy above, a refund may be considered — at the sole discretion of Odisha Television Limited — only under the following strictly limited exceptional circumstances:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Duplicate charge: </span>
          You were charged more than once for the same subscription period due to a payment system error attributable to Odisha Television Limited or its payment processing partners.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Incorrect amount charged: </span>
          The amount actually debited from Your account differs from the displayed subscription price at the time of purchase (₹49/month, ₹365/year full premium, or ₹150/year live channels), and the difference is confirmed as an error.
        </li>
        <li>
          <span style={{ color: '#fff', fontWeight: '600' }}>Extended platform non-availability: </span>
          Hello Meghalaya was completely inaccessible for a continuous period of more than 72 hours during Your active paid subscription period, and the inaccessibility is solely attributable to a failure on our part — not due to Your device, internet connection, browser, application version, or any third-party service.
        </li>
      </ul>
      <p>
        Refund requests under these exceptions must be raised within 7 days of the charge date or incident. All such requests are subject to investigation and approval by Odisha Television Limited. Approved refunds will be processed to the original payment method within <span style={{ color: '#fff', fontWeight: '600' }}>7 to 10 business days</span>. Odisha Television Limited's decision on refund eligibility shall be final.
      </p>

      <h3 className="sub-title">6. How to Request a Refund or Raise a Dispute</h3>
      <p><span style={{ color: '#fff', fontWeight: '600' }}>Steps to raise a refund request:</span></p>
      <p>
        Email us at <span style={{ color: '#F5841F' }}>Hello Meghalaya@odishatv.in</span> with the subject line: <span style={{ color: '#fff', fontWeight: '600' }}>"Refund Request – [Your Registered Mobile Number]"</span>
      </p>
      <p>In the email, include:</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Your registered name and mobile number</li>
        <li>Your registered email address</li>
        <li>Transaction ID or payment reference number</li>
        <li>Screenshot or proof of the charge (if available)</li>
        <li>A clear description of the reason for Your refund request</li>
      </ul>
      <p>
        Our team will acknowledge Your request within <span style={{ color: '#fff', fontWeight: '600' }}>48 hours</span>. A resolution will be communicated to You within <span style={{ color: '#fff', fontWeight: '600' }}>7 business days</span> of acknowledgement. If Your request is approved, the refund will be processed to Your original payment method within <span style={{ color: '#fff', fontWeight: '600' }}>7 to 10 business days</span> from the date of approval.
      </p>

      <h3 className="sub-title">7. Cancellation of Subscription (Without Refund)</h3>
      <p>
        You may cancel Your Hello Meghalaya subscription at any time. Cancellation does not entitle You to any refund for the remaining period of the active subscription. To cancel:
      </p>
      <ol style={{ paddingLeft: '20px', marginBottom: '15px' }}>
        <li>Log in to Your Hello Meghalaya account.</li>
        <li>Navigate to Account Settings &gt; Manage Subscription &gt; Cancel Subscription.</li>
        <li>Alternatively, contact us at <span style={{ color: '#F5841F' }}>Hello Meghalaya@odishatv.in</span> or call <span style={{ color: '#fff', fontWeight: '600' }}>7077710423</span> and our team will assist You.</li>
      </ol>
      <p>
        Upon cancellation, Your subscription will remain active and accessible until the end of Your current paid period. No refund will be issued for the remaining days. Once the paid period ends, Your account will revert to a free/basic access tier (if available) or be deactivated.
      </p>

      <h3 className="sub-title">8. Termination and Suspension</h3>
      <p>
        As a Subscription User, Your right to use Hello Meghalaya shall automatically terminate on the expiry of the term of Your Subscription Package. You may discontinue Your participation in and access to Hello Meghalaya at any time.
      </p>
      <p>
        You agree that upon suspension or termination of Your account — whether initiated by You or by Odisha Television Limited — <span style={{ color: '#fff', fontWeight: '600' }}>no amount shall be refunded to You by Odisha Television Limited</span>, regardless of the reason for or timing of such suspension or termination. This applies whether the termination is due to a violation of our Terms of Use or any other reason.
      </p>

      <h3 className="sub-title">9. Changes to This Policy</h3>
      <p>
        Odisha Television Limited reserves the right to modify this Cancellation and Refund Policy at any time at its sole discretion. Changes, if any, will be communicated via email to registered users or via a notice on the platform. Continued use of Hello Meghalaya after any modification constitutes Your acceptance of the revised Policy. You are advised to review this Policy periodically.
      </p>

      <h3 className="sub-title">10. Contact Us</h3>
      <p>For any questions or grievances regarding this Cancellation and Refund Policy, please reach out to us at:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '15px' }}>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Email: </span><span style={{ color: '#F5841F' }}>Hello Meghalaya@odishatv.in</span></li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Phone: </span>7077710423</li>
        <li><span style={{ color: '#fff', fontWeight: '600' }}>Address: </span>N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha 751024</li>
      </ul>
      <p>
        For escalated grievances related to personal data or subscription disputes, you may also contact our Grievance Officer, <span style={{ color: '#fff', fontWeight: '600' }}>Manoj Panigrahi</span> (Senior Manager, Compliance), at the email above. Grievances will be acknowledged within 48 hours and resolved within 30 days.
      </p>
    </div>
  );
};

export default Refundcontent;
