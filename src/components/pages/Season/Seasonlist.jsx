import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  sidebarDisable,
  sidebarAllow,
} from "../../../redux/reducer/landingReducer.jsx";
// import { getepisode } from '../../../Redux/reducer/episodeReducer.jsx'
import { activeIndexSeason, getSeason } from '../../../redux/reducer/seasonReducer.jsx'
import SeasonIistItem from './SeasonIistItem.jsx'

const Seasonlist = (props) => {
  const {catalog_object_friendly_id,friendly_id} = useParams();
  
   const scrollingRef=useRef()
   const dispatch=useDispatch()
    const {data,onFocus}=props
    const {ref,focusKey,focusSelf}=useFocusable({onFocus})
    const onAssetFocus = useCallback(({ y}) => {
      if (!!scrollingRef.current) {
      scrollingRef.current.scrollTop = y;
      }
    },[scrollingRef]);
   
    useEffect(()=>{
   
      dispatch(sidebarDisable())
    },[])

    const onEnterSeasonList=(item)=>{
      const param={
        catalog_object_friendly_id: catalog_object_friendly_id,
        friendly_id: friendly_id,
        subcategory_friendly_id: item?.friendly_id,  
      }
      dispatch(getSeason(param))
      dispatch(activeIndexSeason(item.title))
    }

  return (
    <FocusContext.Provider value={focusKey}>
        <div  ref={ref}>
          <div ref={scrollingRef} style={{overflow:'hidden',height:"74vh"}}>
              {
                (data?.length)?(
                  data?.map((each)=>(
                    
                      <SeasonIistItem data={each} onFocus={onAssetFocus}   onEnterPress={()=>{onEnterSeasonList(each)}} onEnterSeasonList={onEnterSeasonList}/>
                      
                    ))
                ):("")
              }
          </div>
        </div>
    </FocusContext.Provider>
  )
}

export default Seasonlist