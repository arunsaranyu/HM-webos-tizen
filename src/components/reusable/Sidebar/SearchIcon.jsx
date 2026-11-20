import React, { useEffect } from 'react'

import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import "./Sidebar.scss"
import { useDispatch, useSelector } from 'react-redux'
import { activeIndexSidebar, sidebarToggleFalse } from '../../../redux/reducer/landingReducer.jsx'
import { sidebarFocused } from '../../../redux/reducer/sidebarReducer.jsx'

const SearchIcon = (props) => {
  const { route, onEnterPress, index, activeIndex,lastfocusedKey, onArrowPress, handleEnterpress } = props
  const { ref, focused,focusKey } = useFocusable({
    onEnterPress,
    onArrowPress,
    focusKey: props.focusKey,
    trackChildren: true,
  })
  const lastfocused=useSelector((state)=>state?.sidebar?.sidebarFocuseKey)
  const dispatch = useDispatch()
  useEffect(()=>{
  
    dispatch(sidebarFocused(props.focusKey))
    if(sidebartoggole==true){
      setFocus(lastfocused)
    }
  },[])
  const handleClick = () => {
    dispatch(sidebarToggleFalse())
    handleEnterpress(route)
    lastfocusedKey(focusKey)
  }
  const active = useSelector((state) => state?.landing?.activeIndex)
  const sidebartoggole = useSelector((state) => state?.landing?.sidebartoggle)
  useEffect(() => {
    if (window.location.hash.slice(2) === undefined) {
       dispatch(activeIndexSidebar("home"))
    }  
   
  }, [active])
  return (
    <div  onClick={handleClick} className='item' ref={ref} >
      {index == active ? <img className={sidebartoggole ? "margin-left" : ""} src={route.sidebarImage.focused} alt="" /> :
        <img className={sidebartoggole ? "margin-left" : ""} src={focused ? route.sidebarImage.focused : route.sidebarImage.notFocused} alt="" onClick={handleClick}
          onMouseOver={e => (e.currentTarget.src = route.sidebarImage.focused)}
          onMouseOut={e => (e.currentTarget.src = route.sidebarImage.notFocused)}
        />}
     
        {
          sidebartoggole ? <h1 className={(focused)?'sidebar-title-focused':'sidebar-title'}>{route.title}</h1> : ""
        }
  
    </div>
  )
}

export default SearchIcon
