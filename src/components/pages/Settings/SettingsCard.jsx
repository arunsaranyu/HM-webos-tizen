import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React from 'react'
import "./Settings.scss"
const SettingsCard = (props) => {
  const {onEnterPress,card,redirection,onFocus}=props
    const { ref, focused } = useFocusable({onEnterPress,onFocus});
    const handleClick = () =>{
        redirection(card)
    }
  return (
    <div className={focused ? 'card-setting-focused' : 'setting-card'} ref={ref} onClick={handleClick}>
       
                <img src={card.Icon} alt='' />
                <h3 className={focused?"card-title-focused":"card-title"}>{card.Name}</h3>
        
        </div>
  )
}

export default SettingsCard
