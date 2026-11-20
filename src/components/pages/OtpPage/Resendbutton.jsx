import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React from 'react'

const Resendbutton = (props) => {
    const {onEnterPress, onEnter}=props
    const {ref,focused}=useFocusable({onEnterPress})
    
    const onClickhandler=()=>{ 
        onEnter()
      }
    
    
      return (
        <button ref={ref} onClick={onClickhandler} className={focused?"button-focused":"button"} type='button'>Resend</button>
      )
}

export default Resendbutton