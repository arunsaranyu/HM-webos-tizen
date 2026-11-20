import React from 'react';
import { useState } from 'react';

import './InstaPlayer.scss'

const InstaPlayer = (props) => {
    const [visible, setVisible] = useState('');
   
    window.playerLoadedCallback = function () {     
        visible ? setVisible('') : setVisible('loader isLoaded');
      
    }

    return (
        <div className="instaPlayer">
            {/* Player will invoke here */}
            <div className={visible || 'loader isLoading'}>
                <div className="loading">
                </div>
            </div>
        </div>
    )
}

export default InstaPlayer