import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getpackdetails, setFocusedPlanTitle } from '../../../redux/reducer/plansreducer.jsx'
import './Plans.scss';
const Plansitem = (props) => {
  const { data, onFocus } = props
  const { ref, focused } = useFocusable({ onFocus })
  const plansdata = useSelector((state) => state?.plans.plans);

  const dispatch = useDispatch();
  const title = data[0]
  useEffect(() => {
    if (focused === true) {
      const focusedPlanTitle = title + (data[1]?.offer_description ? (' - ' + data[1]?.offer_description) : '') + ' / ' + data[1]?.title;;
      dispatch(setFocusedPlanTitle(focusedPlanTitle));
      dispatch(getpackdetails(data[2]));
    }
  }, [focused, plansdata, title])

  const scrollRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
       
        ref.current.scrollTop -= 150;
      } else if (event.key === 'ArrowDown') {
        ref.current.scrollTop += 150;
      }
    };


    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollRef]);
 
  return (
    <div id="button" className={`${focused ? "plans-focused" : "plans-card"}`} ref={ref}>
      <h3>{`${data[0]}/ ${data[1]?.title}`}</h3>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
        <h3>{data[1].currency_symbol} {data[1].price}</h3>
        <h3 className={'plansStrikedPrice'} style={{ textDecoration: 'line-through' }}>{data[1].striked_price ? data[1].currency_symbol + data[1].striked_price : ""}</h3>
      </div>
    </div>
  )
}

export default Plansitem