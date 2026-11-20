import React from 'react';
import {useFocusable} from '@noriginmedia/norigin-spatial-navigation'

const NetworkModalButton = (props) =>{
    const {name,onEnterPress,confirmPress} = props
    const { ref,focused } = useFocusable({onEnterPress});
    const handleClick = () =>{
        confirmPress()
    }
 
    return (
        <div ref={ref} > 
            <button className={'' + (focused ? ' focused' : '')} onClick={handleClick} >{name}</button>
        </div>
    )
}

export default NetworkModalButton