import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react';
import contactUsIcon from '../../../assets/images/icon_contactUs.svg';

const Contactcontent = (props) => {
  const { onArrowPress } = props;
  const { ref } = useFocusable({ onArrowPress });

  return (
    <div ref={ref} className="content" style={{ lineHeight: '1.6', fontFamily: 'euclid-regular' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <img src={contactUsIcon} alt="Contact Us" style={{ width: '40px', height: '40px' }} />
        <h3 className="sub-title" style={{ margin: 0 }}>Contact Us</h3>
      </div>
      <p>
        Welcome to Hello Meghalaya! If you have any questions, feedback, or need assistance regarding your subscription, account, or video playback, please feel free to reach out to our customer support team.
      </p>

      <h3 className="sub-title">Customer Support</h3>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', margin: '15px 0' }}>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Email: </span>
          Hello Meghalaya@odishatv.in
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Phone / WhatsApp: </span>
          +91 – 7077710423
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Support Hours: </span>
          Monday to Friday, 10:00 AM – 6:00 PM
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Official Website: </span>
          www.Hello Meghalaya.in
        </p>
      </div>

      <h3 className="sub-title">Corporate & Registered Office</h3>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', margin: '15px 0' }}>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Company: </span>
          Odisha Television Limited
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Address: </span>
          N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha – 751024, India
        </p>
      </div>

      <h3 className="sub-title">Grievance Redressal</h3>
      <p>
        In accordance with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of our designated Grievance Officer are as follows:
      </p>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', margin: '15px 0' }}>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Name: </span>
          Manoj Panigrahi
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Designation: </span>
          Senior Manager, Compliance
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Organisation: </span>
          Odisha Television Limited
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Email: </span>
          Hello Meghalaya@odishatv.in
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Phone / WhatsApp: </span>
          +91 – 7077710423
        </p>
        <p style={{ margin: '4px 0' }}>
          <span style={{ color: '#fff', fontWeight: '600' }}>Address: </span>
          N/28-30/1, Chandaka Industrial Estate, Prasanti Vihar, Patia, Bhubaneswar, Odisha – 751024, India
        </p>
      </div>
      <p>
        Any grievance raised will be acknowledged within 48 hours and disposed of within 30 days in accordance with applicable rules.
      </p>
    </div>
  );
};

export default Contactcontent;
