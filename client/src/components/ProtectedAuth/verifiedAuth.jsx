import React from 'react'

const verifiedAuth = () => {
    const {currentUser: {isVerified}, isLoggedIn} = useSelector(state => state.auth)
  return (
    !isVerified 
        ? <Navigate to='/login' replace />
        : <Outlet />
  )
}

export default verifiedAuth