import React from 'react'
// import danaglPlay_loader from "../../assets/images/danaglPlay_loader.gif"

const Loader = (props) => {
  const { position, left, top, backgroundcolor, color } = props;

  return (
    <div style={{ backgroundColor: backgroundcolor }} className='loader-container'>
      <div
        className='loader'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          ...(color ? { borderColor: color, borderBottomColor: 'transparent' } : {})
        }}
      ></div>
    </div>
  );
};

export default Loader
