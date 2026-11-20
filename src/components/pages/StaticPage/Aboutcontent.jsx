import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react';

const Aboutcontent = (props) => {
  const { onArrowPress } = props;
  const { ref } = useFocusable({ onArrowPress });

  return (
    <div ref={ref} className="content" style={{ lineHeight: '1.6', fontFamily: 'euclid-regular' }}>
      <h3 className="sub-title">About Hello Meghalaya</h3>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Hello Meghalaya</span>, Odisha's first online video streaming Over The Top (OTT) platform owned by <span style={{ color: '#fff', fontWeight: '600' }}>Odisha Television Ltd</span>. Hello Meghalaya is the one-stop destination for All Odia Entertainment.
      </p>
      <p>
        <span style={{ color: '#fff', fontWeight: '600' }}>Watch your favorite show anywhere any time: </span>
        Hello Meghalaya brought you TV shows, Live TV, Odia Jatra, Movies, Mega Serials, Video Songs, News and much more under one roof. Now access all of your favorite entertainment on your fingertips with Hello Meghalaya be it on the bus, at work or home in your smartphone, tablet or laptop and connected TVs.
      </p>
      <p>
        We offer a comfortable and friendly user experience with highly evolved video streaming technology. Our video streaming technology ensures that the best possible video quality is played back automatically based on the available bandwidth, therefore making it a great video experience on both mobile networks as well as WiFi internet connections. Seamless Video playback, Smart Content Search & Recommendation, Option to choose Video Quality gives you a video experience like never before.
      </p>
      <p>
        Hello Meghalaya can be accessed at <span style={{ color: '#fff', fontWeight: '600' }}>www.Hello Meghalaya.in</span> and mobile application is available on the <span style={{ color: '#fff', fontWeight: '600' }}>Google Play Store</span> and <span style={{ color: '#fff', fontWeight: '600' }}>Apple App Store</span> and also on connected TVs for <span style={{ color: '#fff', fontWeight: '600' }}>Android TV</span> and <span style={{ color: '#fff', fontWeight: '600' }}>Fire TV</span>.
      </p>
    </div>
  );
};

export default Aboutcontent;