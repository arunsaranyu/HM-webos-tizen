import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from '../redux/reducer/loginReducer.jsx'
import { watchlatertoast } from '../redux/reducer/detailsReducer.jsx'
import { setEditStatus } from '../redux/reducer/profileReducer.jsx'
import { setCreateProfile } from '../redux/reducer/profileReducer.jsx'
const Alert = (props) => {
  const{imgicon,text,backgroundcolor,bordercolor,from,setalertpopup}=props
 const dispatch=useDispatch()

setTimeout(()=>{
   dispatch(toast(false))
   dispatch(setEditStatus(false))
   dispatch(watchlatertoast(false))
   setalertpopup(false)
   dispatch(setCreateProfile(false))
},4000)

  return (
    <div className='popup-alert' style={{backgroundColor:backgroundcolor,borderColor:bordercolor}}>
      <img src={imgicon} alt="" width={50} height={50}/>
      <p>{text}</p>
    </div>
  )
}

export default Alert