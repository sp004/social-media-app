import React, { Suspense, lazy, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { axiosPrivate } from './api/apiRequest'
import Layout from './components/Layout'
import { logout, reset } from './features/auth/authSlice'
import { GlobalStyles } from './styles/globalStyles'
import { darkTheme, lightTheme } from './styles/theme'
import RequireAuth from './components/ProtectedAuth/RequireAuth'
import Navbar from './components/Navbar/Navbar'
import Settings from './components/Layout/Settings'
import { ChatContext } from './context/ChatContext'
import { SocketContext } from './context/socketContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeContext } from './context/themeContext'
import { Toaster } from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { resetFriends } from './features/friend/friendSlice'

const Home = lazy(() => import('./pages/Home/Home'))
const Feed = lazy(() => import('./pages/Feed/Feed'))
const VerifyUser = lazy(() => import('./pages/VerifyUser/VerifyUser'))
const ForgetPassword = lazy(() => import('./pages/ForgetPassword/ForgetPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'))
const SharedPost = lazy(() => import('./pages/SharedPost/SharedPost'))
const SearchedPost = lazy(() => import('./pages/SearchedPost/SearchedPost'))
const Friends = lazy(() => import('./pages/Friends/Friends'))
const Chat = lazy(() => import('./pages/Chat/Chat'))
const Notification = lazy(() => import('./pages/Notification/Notification'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))
//const Settings = lazy(() => import('./pages/Settings/Settings')


const queryClient = new QueryClient()

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentUser, accessToken, message, isLoggedIn} = useSelector(state => state.auth)
  const {message: msg, unblockedUsers} = useSelector(state => state.user)
  // const socket = useRef()
  const [openMenuBox, setOpenMenuBox] = useState(false)
  const {setConversation, conversation, allConversations, setAllConversations} = useContext(ChatContext)
  const {socket, setOnlineUsers} = useContext(SocketContext)
  const {darkMode} = useContext(ThemeContext)
  const {pathname} = useLocation()

  useEffect(() => {
    // console.log("...........calling setup from client")
    socket?.emit("setup", {id: currentUser?._id, fullname: currentUser?.fullname})
    socket?.on("online", (users) => {
      users = users?.filter(user => user?.userId !== currentUser?._id)
      setOnlineUsers(unblockedUsers?.filter(u => !u.isBlocked)?.filter(user => users?.some(u => u?.userId === user?._id)))
      // console.log(users, onlineUsers)
    })
  }, [socket, currentUser])

  //logout when error code is 403
  useEffect(() => {
    if(message?.startsWith('Invalid token') || msg?.startsWith('Invalid token') && isLoggedIn){
      dispatch(logout())
      dispatch(reset())
      dispatch(resetFriends())
    }
  }, [message, msg, dispatch])

  useEffect(() => {
    axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${accessToken ? accessToken : ''}`;
  }, [accessToken])
  
  //setting conversation state to empty object when page changes
  useEffect(() => {
    if(pathname.split('/')[1] !== 'chat'){
      conversation?._id && setConversation({})
      //remove the conversation having empty message
      const newConversation = allConversations?.filter(conversation => conversation?.lastMessage === undefined)
      newConversation?.length && 
        axiosPrivate.delete(`/conversation/${newConversation[0]?._id}`)
        .then(res => setAllConversations(allConversations.filter(conversation => conversation._id !== res?.data?.data?._id)))
        .catch(err => console.log("Something went wrong!!!"))
    }
  }, [pathname])
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Toaster toastOptions={{style: {marginTop: '4rem'}}} />
        {isLoggedIn && <Navbar openMenuBox={openMenuBox} setOpenMenuBox={setOpenMenuBox} />}
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={isLoggedIn ? <Navigate to={'/feed'} /> : <Suspense fallback={<ClipLoader />}><Home /></Suspense>} />
            <Route path='forget-password' element={!isLoggedIn ? <Suspense fallback={<ClipLoader />}><ForgetPassword /></Suspense> : <Navigate to={'/feed'} />} />
            <Route path='reset/:resetToken' element={!isLoggedIn ? <Suspense fallback={<ClipLoader />}><ResetPassword /></Suspense> : <Navigate to={'/feed'} />} />

            <Route element={<RequireAuth />}>
              <Route path='verify/:verificationToken' element={<Suspense fallback={<ClipLoader />}><VerifyUser /></Suspense>} />
              <Route path='feed' element={<Suspense fallback={<ClipLoader />}><Feed /></Suspense>} />
              <Route path='posts' element={<Suspense fallback={<ClipLoader />}><SearchedPost /></Suspense>} />
              <Route path='friends' element={<Suspense fallback={<ClipLoader />}><Friends /></Suspense>} />
              <Route path='friend-requests' element={<Suspense fallback={<ClipLoader />}><Friends /></Suspense>} />
              <Route path='chat' element={<Suspense fallback={<ClipLoader />}><Chat /></Suspense>} />
              <Route path='notification' element={<Suspense fallback={<ClipLoader />}><Notification /></Suspense>} />
              <Route path='profile/:userId' element={<Suspense fallback={<ClipLoader />}><Profile /></Suspense>} />
              <Route path='settings' element={<Settings />} />
              <Route path='profile' element={<Settings />} />
              <Route path='bookmarks' element={<Settings />} />
              <Route path='tagged-posts' element={<Settings />} />
              <Route path='blocked-accounts' element={<Settings />} />
            </Route>
            <Route path='shared-post/:postId' element={<Suspense fallback={<ClipLoader />}><SharedPost /></Suspense>} />
          </Route>
          <Route path='*' element={<Suspense fallback={<ClipLoader />}><NotFound /></Suspense>} />
        </Routes>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App