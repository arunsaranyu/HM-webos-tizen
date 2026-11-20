import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Plansitem from './Plansitem.jsx'
import { useRef } from 'react'
// import { PriceDetails } from '../../../Redux/Reducers/planReducer.jsx'

const PlansDetails = (props) => {
    const {data ,onFocus}=props
    const dispatch=useDispatch()
    const{ref,focusKey}=useFocusable({onFocus})
    const scrollingRef=useRef()
    const onAssetFocus = useCallback(
      ({ x }) => {
          if (!!scrollingRef.current) {
   
              scrollingRef.current.scrollLeft = x
          }

      },
      [scrollingRef]
  );

  return (
    <FocusContext.Provider value={focusKey}>

   <div style={{marginBottom:"1rem"}} ref={ref}>
    
    <Plansitem data={data} onFocus={onAssetFocus}
    />
    
   </div>
    </FocusContext.Provider>
  )
}

export default PlansDetails