import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBarExample from '../../reusable/ProgressBar/Progress.jsx'
import { useSelector } from 'react-redux'
// import ProgressBarExample from '../../resuable/ProgressBar/Progress.jsx';

const DetailsIcons = (props) => {
  const { data, onFocus, index, details, enterPress, onEnterPress } = props
  const continueWatching = useSelector((state) => state?.details?.continue)
  const { ref, focusSelf, focused } = useFocusable({ onFocus, onEnterPress })
  const navigate = useNavigate()
  const handleClick = () => {
    enterPress(details, data)
  }

  const textRef = useRef(null);
  // useEffect(()=>{
  //   if(index==0){
  //    focusSelf()
  //   }
  // },[])
  const [textWidth, setTextWidth] = useState(null);

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBoundingClientRect().width;
      setTextWidth(width);
    }
  }, []);
  return (
    <div ref={ref} className={focused ? "details-icons" : "d-icons"} style={focused ? {
      color: "white", background: 'transparent linear-gradient(180deg, #4e5766 0%, #272c33 100%) 0% 0% no-repeat padding-box', border: '2px solid #F5841F'
    } : { color: 'white', background: '#292F36 0% 0% no-repeat padding-box' }}
      onClick={handleClick} >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <img ref={ref}
          src={focused ? data.focusedIcons : data.notFocused}
          onMouseOver={e => (e.currentTarget.src = data.focusedIcons)}
          onMouseOut={e => (e.currentTarget.src = data.notFocused)} />
        {data.name && (
          <div>
            <h1 ref={textRef} className={focused ? 'button-name-focused' : 'button-name'}>
              {data.name}
            </h1>
            {data.name === 'Resume' && continueWatching && (
              <></>
              // <div>
              //   <ProgressBarExample percentage={data.NavType} width={textWidth} />
              // </div>
            )}
          </div>
        )}
      </div>
      {/* {data.name==='Watch Now' && <div><ProgressBarExample percentage={data.NavType} width={textWidth}/></div>} */}
    </div>
  )
}

export default DetailsIcons