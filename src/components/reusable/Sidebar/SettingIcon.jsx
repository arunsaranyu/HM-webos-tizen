import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { activeIndexSidebar, sidebarToggleFalse } from '../../../redux/reducer/landingReducer.jsx'


const SettingIcon = (props) => {
  const { route, onEnterPress, onArrowPress, activeIndex,lastfocusedKey, index, handleEnterpress } = props
  const { ref, focused,focusKey } = useFocusable({
    onEnterPress,
    onArrowPress
  })

  const handleClick = () => {
    dispatch(sidebarToggleFalse())
    handleEnterpress(route)
    lastfocusedKey(focusKey)
  }
  const dispatch = useDispatch()
    const lastfocused=useSelector((state)=>state?.sidebar?.sidebarFocuseKey)
    
    useEffect(()=>{
  
      dispatch(sidebarFocused(props.focusKey))
    if(sidebartoggole==true){
      setFocus(lastfocused)
    }
  },[])
  const sidebartoggole = useSelector((state) => state?.landing?.sidebartoggle)
  const active = useSelector((state) => state?.landing?.activeIndex)

  useEffect(() => {


    if (window.location.hash.slice(2) === undefined) {
      dispatch(activeIndexSidebar("home"))
    } 
  }, [active])
  return (
    <div onClick={handleClick} className='item' ref={ref}>
      {index == active ? <img className={sidebartoggole ? "margin-left" : ""} src={route.sidebarImage.focused} alt="" /> :
        <img className={sidebartoggole ? "margin-left" : ""} src={focused ? route.sidebarImage.focused : route.sidebarImage.notFocused} alt="" 
          onMouseOver={e => (e.currentTarget.src = route.sidebarImage.focused)}
          onMouseOut={e => (e.currentTarget.src = route.sidebarImage.notFocused)}
         
        />}
     
        {
          sidebartoggole ? <h1 className={(focused)?'sidebar-title-focused':'sidebar-title'}>{route.title}</h1> : ""
        }
  
    </div>
  )
}

export default SettingIcon
