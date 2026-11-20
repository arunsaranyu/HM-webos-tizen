import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { activeIndexSidebar, sidebarToggleFalse } from '../../../redux/reducer/landingReducer.jsx'
import { sidebarFocused } from '../../../redux/reducer/sidebarReducer.jsx'


const SidebarItem = (props) => {
  const { route, onEnterPress, handleEnterpress, lastfocusedKey, activeIndex, index, onArrowPress } = props
  const { ref, focused, } = useFocusable({
    onEnterPress,
    onArrowPress,
    focusKey: props.focusKey,
    trackChildren: true,
  })

  const dispatch = useDispatch()
  const lastfocused=useSelector((state)=>state?.sidebar?.sidebarFocuseKey)
  useEffect(()=>{
dispatch(sidebarFocused(props.focusKey))
    if(sidebartoggole==true){
      setFocus(lastfocused)
    }
  },[sidebartoggole])
  const handleClick = () => {
    dispatch(sidebarToggleFalse())
    handleEnterpress(route)
    lastfocusedKey(props.focusKey)
  }
  // const sidebartoggole = useSelector((state) => state?.common?.sidebartoggle)
  const sidebartoggole = useSelector((state) => state?.landing?.sidebarVisibleWithTitle)
  const active = useSelector((state) => state?.landing?.activeIndex)
  useEffect(() => {


    if (window.location.hash.slice(2) === undefined) {
      dispatch(activeIndexSidebar("home"))
    } 
  }, [active])


const focusedDiv = {
  background: 'linear-gradient(to bottom, #242424, #F5841F)',
}
 

  return (
    <div  onClick={handleClick}className='item' ref={ref} >
      {index == active ? <img  style={{ background: 'linear-gradient(to bottom, #242424, #F5841F)'}}className={sidebartoggole ? "margin-left" : ""} src={route.focusedImg} alt="" /> :
        <img className={sidebartoggole ? "margin-left" : ""}  src={focused ? route.sidebarImage.focused : route.sidebarImage.notFocused} alt="" 
          onMouseOver={e => (e.currentTarget.src = route.sidebarImage.focused)}
          onMouseOut={e => (e.currentTarget.src = route.sidebarImage.notFocused)}
           style={focused?{backgroundColor:'#3E3E3E'}:{}}
         
        />}

      {
        sidebartoggole ? <h1 className={(focused)?'sidebar-title-focused':'sidebar-title'}>{route.title}</h1> : ""
      }

    </div >
  )
}
export default SidebarItem
