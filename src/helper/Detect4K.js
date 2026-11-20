import React from 'react'

const Detect4k = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const pixelDensity = window.devicePixelRatio || 1; // `devicePixelRatio` for pixel density
  
    console.log(`Screen Width: ${screenWidth}px`);
    console.log(`Screen Height: ${screenHeight}px`);
    console.log(`Pixel Density: ${pixelDensity}dppx`);
  
    if ((screenWidth >= 3840 && screenHeight >= 2160 ) || pixelDensity >= 2) {
      localStorage.setItem("is_4k_supported", true);

      console.log('4K resolution with high DPI detected!');
    } else {
      localStorage.setItem("is_4k_supported", false);

      console.log('Not a 4K resolution or insufficient DPI.');
    }
  };
  
  
          


export default Detect4k

