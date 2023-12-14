import React, { useContext, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { logout, reset } from '../../features/auth/authSlice'
import { Link, NavLink } from 'react-router-dom';
import { flexCol } from '../../styles/variables';
import { SocketContext } from '../../context/socketContext';
import { device } from '../../styles/responsive';
import { resetFriends } from '../../features/friend/friendSlice';

const MenuContainer = styled.div`
    width: 200px;
    height: fit-content;
    background-color: #efefef;
    position: fixed;
    top: 6%;
    right: 3%;
    /* top: 50%; */
    border-radius: 5px;
    padding: 2px;
    border: 2px solid ${({theme}) => theme.bgPrimary};
    z-index: 999;

    @media ${device.tabletS}{ 
      display: none;
    }
`

const MenuItems = styled.ul`
    ${flexCol}
`

const Menu = styled(Link)`
    padding: 12px 16px;
    position: relative;
    width: 100%;
    font-size: 14px;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};

    &:hover{
        background-color: ${({theme}) => theme.bgPrimary};
    }

    &:not(:last-child){
        border-bottom: 1px solid #838383;
    }
`

const MenuBox = ({setOpenMenuBox, username}) => {
    const dispatch = useDispatch()

    const logoutHandler = async () => {
      setOpenMenuBox(false)
        confirmAlert({
          title: 'Confirm to Logout',
          message: 'Do you want to exit',
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                  await dispatch(logout())
                  await dispatch(reset())
                  await dispatch(resetFriends())
              }
            },
            {
              label: 'No',
            }
          ]
        })
      };

    const closeMenuBox = () => {
      setOpenMenuBox(false)
    }

  return (
    <MenuContainer onMouseLeave={closeMenuBox}>
      <MenuItems>
        <Menu to={`/profile/${username}`} onClick={closeMenuBox}>View Profile</Menu>
        <Menu to={`/settings`} onClick={closeMenuBox}>Settings</Menu>
        <Menu onClick={logoutHandler}>Logout</Menu>
      </MenuItems>
    </MenuContainer>
  )
}

export default MenuBox