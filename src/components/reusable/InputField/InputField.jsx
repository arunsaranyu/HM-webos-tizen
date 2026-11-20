import React,{useRef,useEffect} from 'react'
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'


const InputField = (props) => {
    const {id,width,type,maxLength,value,inputFocus,setvalue,focusedbackgroundcolor,placeholder, onFocus,unfocusedbackgroundcolor,from}=props
    const { ref, focused } = useFocusable({ onFocus })
 

    useEffect(() => {
      if (focused === true) {
        inputFocus.current && inputFocus.current.focus()
      } else {
        inputFocus.current && inputFocus.current.blur()
      }
    }, [focused])

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.stopPropagation()
      }
      if (e.key === 'ArrowRight') {
        e.stopPropagation()
      }
      if (e.key === 'ArrowUp') {
        e.stopPropagation()
      }

    };
    const onchangehandler=(e)=>{
    
      if (id=="otp" || id=="mobile"){
       setvalue(e.target.value.replace(/[^0-9]/g, '').substr(0, maxLength)
       )
      }else{
  setvalue( e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').substr(0, maxLength))

      }

    }
    return (
    <div ref={ref}>
     <input id={id} style={focused?{backgroundColor:focusedbackgroundcolor,width:width}:{backgroundColor:unfocusedbackgroundcolor,width:width}} className='input-field' 
     placeholder={placeholder}
     ref={inputFocus}
     value={value}
     onChange={(e)=>onchangehandler(e)}
     autoComplete="off" 
     type={type}
     maxlength={maxLength}
     onKeyDown={handleKeyDown} 
      />
    </div>
  )
}

export default InputField