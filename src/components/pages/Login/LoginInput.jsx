import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const LoginInput = (props) => {
  const { ref, focused } = useFocusable({ onFocus })
  const { inputFocus, onFocus, moblieNumber, setMobileNumber, maxLength, inputType } = props
  const dispatch = useDispatch()
  const [value, setValue] = useState()
  const onChangeHandler = (e) => {
  
    setValue(e.target.value)
    inputType === "number" ?
      setMobileNumber(e.target.value.replace(/[^0-9]/g, '').substr(0, maxLength))
      : setMobileNumber(e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').substr(0, maxLength))

    // dispatch(getSearch(e.target.value))
  }


  useEffect(() => {
    if (focused === true) {
      inputFocus.current && inputFocus.current.focus()
    }
    else {
      inputFocus.current && inputFocus.current.blur()
    }
  }, [focused])
  return (
    <div ref={ref} className='input-login'>
      <input ref={inputFocus} type={inputType} value={moblieNumber} onInput={(e) => onChangeHandler(e)} placeholder='' required />
    </div>
  )
}

export default LoginInput