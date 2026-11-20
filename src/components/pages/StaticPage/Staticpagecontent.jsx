import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const Staticpagecontent = (props) => {
    const { page } = useParams()
    const {onArrowPress}=props
  const {ref}=useFocusable({onArrowPress})
  const staticUrl = useSelector((state) => state?.Common)




  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios.get(`${staticUrl[`${page}`]}`)
        const data = await response.text();
   
        setContent(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading webpage:', error);
      }
    };

    fetchData();
  }, []);

  



  document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to fully load before attaching the event listener
    
    var iframe = document.getElementById(`${page}`); // Replace with your iframe's ID
    console.log(iframe.contentWindow);
    
    iframe.contentDocument.addEventListener('keydown', function(event) {
      // Attach the event listener to the iframe's contentDocument
      
      if (event.key === 'ArrowDown') {
        iframe.contentWindow.scrollBy(0, 50); // Scroll down 50 pixels
        event.preventDefault(); // Prevent default arrow key behavior
      } else if (event.key === 'ArrowUp') {
        iframe.contentWindow.scrollBy(0, -50); // Scroll up 50 pixels
        event.preventDefault(); // Prevent default arrow key behavior
      }
    });
  });
  




    return (
    <div     style={{width:"100%",height:"100vh"}}>
           <iframe  ref={ref} id={`${page}`}  loading='eager' frameBorder="0" scrolling='yes'  crossorigin="anonymous" src={staticUrl[`${page}`]} width="100%" height="100%"></iframe>
    </div>
  )
}

export default Staticpagecontent