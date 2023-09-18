import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, useNavigate } from 'react-router-dom'

const RequireAuth = () => {
    const {isLoggedIn, accessToken} = useSelector(state => state.auth)

  return (
    !isLoggedIn 
        ? <Navigate to='/' replace />
        : !accessToken 
          ? <Navigate to='/' replace />
          : <Outlet />
  )
}

// const RequireAuth = ({ element: Component, ...rest }) => {
//     console.log(...rest, Component)
//     const navigate = useNavigate();
//   const isLoggedIn = useSelector(state => state.auth);

//   if (!isLoggedIn) {
//     navigate('/');
//     return <Navigate to="/" replace />;
//   }

//   return <Route {...rest} element={<Component />} />;
// }

export default RequireAuth