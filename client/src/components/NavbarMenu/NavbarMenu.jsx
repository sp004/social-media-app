import React, { useContext, useEffect } from 'react'
import { Counter, Menu, Menus } from '../Navbar/styles'
import { NavLink } from 'react-router-dom'
import { Avatar } from '../CreatePost/styles'
import MenuBox from '../MenuBox/MenuBox'
import { useSelector } from 'react-redux'
import { AiFillHome } from 'react-icons/ai'
import { FaUserFriends } from 'react-icons/fa'
import { IoIosChatboxes } from 'react-icons/io'
import { IoNotifications } from 'react-icons/io5'
import { SocketContext } from '../../context/socketContext'

const NavbarMenu = ({openMenuBox, setOpenMenuBox}) => {
    const {currentUser, isLoggedIn} = useSelector(state => state.auth)
    const {socket, notifications, setNotifications} = useContext(SocketContext)
    const {friendRequestsReceived} = useSelector(state => state.friend)

    useEffect(() => {
      socket?.on("getNotification", (data) => {
        setNotifications(prev => [...prev, data])
      })
    }, [socket])

  return (
    <Menus>
        <Menu to={`/feed`} activeclassname="activeLink">
          <AiFillHome />
        </Menu>

        <Menu to={`/friends`} activeclassname="activeLink">
          <FaUserFriends />
          {friendRequestsReceived?.length > 0 && <Counter>{friendRequestsReceived?.length}</Counter>}
        </Menu>

        <Menu to={`/chat`} activeclassname="activeLink">
          <IoIosChatboxes />
        </Menu>

        <Menu to={`/notification`} activeclassname="activeLink">
          <IoNotifications />
          {[...new Set(notifications)]?.length > 0 && <Counter>{[...new Set(notifications)]?.length}</Counter>}
        </Menu>

      {isLoggedIn 
      ? <NavLink to={`/profile/${currentUser?.username}`} style={{display: 'flex'}} onMouseEnter={() => setOpenMenuBox(true)} onMouseLeave={() => setOpenMenuBox(false)}>
        <Avatar src={currentUser?.profilePic} alt={currentUser?.fullname} />
        {openMenuBox && <MenuBox setOpenMenuBox={setOpenMenuBox} username={currentUser?.username} />}
      </NavLink> 
      : 
      <>
        <NavLink to='/' style={{color: '#fff'}}>Login</NavLink>
      </>}
    </Menus>
  )
}

export default NavbarMenu