import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PopupButton = (props) => {
  const {each,onEnterPress,onclickpopup}=props
    const navigate = useNavigate()
    const {ref,focused}=useFocusable({onEnterPress})
    const onhandler=()=>{
      onclickpopup(each,navigate)

    }

  return (
    // <div>
    <button  ref={ref}
      className={focused ? 'button-pop-focused' : 'button-pop'}
      onClick={onhandler}
    >
      {each}
    </button>
  // </div>
  )
}

export default PopupButton