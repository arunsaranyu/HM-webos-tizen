import React from 'react'
import PopupButton from './PopupButton.jsx'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sidebarDisable } from '../redux/reducer/landingReducer.jsx'
// import { signout } from '../../Redux/reducer/signInReducer.jsx'

const Popup = (props) => {
  const { ref, focusSelf, focusKey } = useFocusable({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const{text,setpopup,title,note,from,onhandler}=props
  const { alert,
    alertType,
    image = "",
    heading,
    Description,
    from, onSubmit } = props

  useEffect(() => {
    focusSelf()
    dispatch(sidebarDisable())
  }, [focusSelf])

  let buttonArray
  if (from == "delete" || from == "exit") {
    buttonArray = ['Yes', 'No']
  }
  else if (from == "signout") {
    buttonArray = ['Cancel', 'Logout']
  }
  else if (from == "login") {
    buttonArray = ["Login",  "Cancel"]
  }
  else if (from == "exitmodal") {
    buttonArray = ['Cancel', 'Exit']
  }
  else if (from == "network") {
    buttonArray = ["Go Back"]
  } else if (from == "details") {
    buttonArray = ["Go to Plans", "Go Back"]
  }
  else if (from == "screenlimit") {
    buttonArray = ["Retry", "Signout all"]
  }
  else if (from == "session") {
    buttonArray = ["Login", "Continue without login"]
  }
  else {
    buttonArray = ["Go Back"]
  }

  const onclickpopup = (confirm, navigate) => {

    onSubmit(confirm, navigate)

  }
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="main_banner">
        <div className="alerts">
          <p>{alert}</p>
          <h1 style={{ width: "auto" }}>{alertType}</h1>
        </div>
        <div className="Details">
          {image != "" ? <img src={image} alt="" /> : ""}
          <h1>{heading}</h1>
          <p>{Description}</p>
          <div className="ButtonsDisplay">
            {buttonArray?.map((each) => (
              <PopupButton each={each} onEnterPress={() => onclickpopup(each, navigate)} onclickpopup={onclickpopup} />
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default Popup