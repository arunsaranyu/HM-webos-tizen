import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react'

const ExitModalButton = (props) => {
 
   const {confirmPress,name,key,onEnterPress}=props
 const { ref,focusKey,focused } = useFocusable({onEnterPress});
    
    const handleClick=()=>{
     confirmPress(name)
    }
    return (
        <div ref={ref}>
            <button className={'button-pop-exit' + (focused ? ' focused' : '')} onClick={handleClick} >{name}</button>
        </div>
    )
}

export default ExitModalButton