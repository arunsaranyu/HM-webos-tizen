import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sidebarFocused } from '../../../redux/reducer/sidebarReducer.jsx'

const Profile = (props) => {
  const { onRenderProfile, onEnterPress,lastfocusedKey } = props
  const dispatch = useDispatch()
  const { ref, focused, focusKey } = useFocusable({ onEnterPress,
    focusKey: props.focusKey,
    trackChildren: true,
   })
  const sidebartoggole = useSelector((state) => state?.landing?.sidebarVisibleWithTitle)
  const lastfocused = useSelector((state) => state?.sidebar?.sidebarFocuseKey)
  useEffect(() => {
    dispatch(sidebarFocused(props.focusKey))
   
      setFocus(lastfocused)
    
  }, [])
  return (

    <div className='item' ref={ref} onClick={onRenderProfile}>
      {/* <div ref={ref} onClick={onClickProfile} style={sidebartoggole==true?{display:"",justifyContent:"center",flexDirection:""}:{}}  className={focused?'profile-img-focused':"profile-img"}> */}
      {focused ? <img className={sidebartoggole ? "margin-left" : ""} src={!!localStorage.getItem("image_url") ? localStorage.getItem("image_url") : ""} alt={""} style={{ border: '3px solid #3e3e3e' }} />
        : <img className={sidebartoggole ? "margin-left" : ""} src={!!localStorage.getItem("image_url") ? localStorage.getItem("image_url") : ""} alt={""} />
      }
      {
        sidebartoggole ? <h1 className={focused ? 'sidebar-title-focused' : 'sidebar-title'}>{localStorage.getItem('sidebarProfileName')}</h1> : ""
      }

    </div>


  )
}

export default Profile