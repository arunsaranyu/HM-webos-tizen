import React, { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useNavigate, } from 'react-router-dom'

const ProtectedRoutes = (props) => {
  const { show, navigate } = props
  const session_id = localStorage.getItem("session_id")

  if (session_id != null || session_id != undefined) {
    return <Navigate to="/" />
  }
  else {
    return <Outlet />
  }

}



export default ProtectedRoutes



