import React, { useState } from 'react';
import './Progress.scss';
const ProgressBarExample = (props) => {
  return (
    <div className='pBarExample'>
      <ProgressBar percentage={props.percentage}/>
    </div>
  );
};

const ProgressBar = (props) => {
    // console.log(props)
  return (
    <div className="progress-bar">
      <Filler percentage={props.percentage} />
    </div>
  );
};

const Filler = (props) => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} />;
};

export default ProgressBarExample;
