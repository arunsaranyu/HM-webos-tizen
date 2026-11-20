import React, { useEffect } from 'react'
import ExitModalButton from './ExitModalButton.jsx'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useDispatch } from 'react-redux'
import { sidebarAllow } from '../redux/reducer/landingReducer.jsx'

const ExitModal = (props) => {
    const { show, closeApp, cancelClose, alert, image, alertType, heading, Description } = props
    const {  focusKey, focusSelf } = useFocusable({ isFocusBoundary: true, onArrowPress: () => true })
 
    let buttonArray = ['Exit', 'Cancel']
const dispatch=useDispatch()
dispatch(sidebarAllow())
    useEffect(() => {
        focusSelf();
    }, [show]);
    if (!show) {
        return null
    }


    const confirmPress = (confirm) => {
        if (confirm === 'Exit') {
            closeApp()
        } else {

            cancelClose()
        }

    }
    return (
        <FocusContext.Provider value={focusKey}>
        <div  className="main_banner">
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
              <ExitModalButton name={each} onEnterPress={() => confirmPress(each)} confirmPress={confirmPress} />
            ))}
          </div>
        </div>
      </div>
        </FocusContext.Provider>
    )
}

export default ExitModal