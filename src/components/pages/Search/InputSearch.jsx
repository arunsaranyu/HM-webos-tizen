import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getSearch, searchValue, setEmptySearch } from '../../../redux/reducer/SearchReducer.jsx'

const InputSearch = (props) => {
  const { inputFocus, id, onFocus } = props
  const { ref, focused, focusSelf } = useFocusable({ onFocus })
  const [value, setValue] = useState("")
  const dispatch = useDispatch()



  const onChangeHandler = (e) => {
    const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').substr(0, 99999)
    setValue(cleanValue)
    if (cleanValue.trim().length > 0) {
      dispatch(getSearch(cleanValue))
    } else {
      dispatch(setEmptySearch())
    }
    dispatch(searchValue(cleanValue))
  }

  useEffect(() => {
    if (focused === true) {
      inputFocus.current && inputFocus.current.focus()
    }
    else {
      inputFocus.current && inputFocus.current.blur()
    }
  }, [focused])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.stopPropagation()
    }
    else if (e.key === 'b') {
      e.stopPropagation();
    }
  };

  return (
    <div ref={ref} className='input-search'>
      <input
        id={id}
        ref={inputFocus}
        type='text'
        onKeyDown={handleKeyDown}
        onChange={(e) => onChangeHandler(e)}
        placeholder='Search for movies, songs & more…'
        value={value}
      />
    </div>
  )
}

export default InputSearch
