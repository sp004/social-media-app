import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { flexCol } from '../../styles/variables'
import { RxCross1 } from 'react-icons/rx'
import { confirmAlert } from 'react-confirm-alert'
import { useDispatch } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import { resetFriends } from '../../features/friend/friendSlice'
import { device } from '../../styles/responsive'
import { sidebarItems } from '../../utils'

const SideMenuContainer = styled.aside`
    display: hidden;
    /* display: ${({open}) => open ? 'block' : 'hidden'}; */
    width: 220px;
    height: 100%;
    background-color: ${({theme}) => theme.navbar};
    position: fixed;
    top: 0;
    right: ${({open}) => open ? '0%' : '-100%'};
    /* padding: 1rem; */
    overflow-y: hidden;
    z-index: 999;
    transition: right 0.4s ease-in-out;
    @media ${device.tabletS}{
        display: block;
    }
`

const CrossIcon = styled(RxCross1)`
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 1rem;
`

const SideMenus = styled.ul`
    width: 100%;
    height: 100%;
    ${flexCol};
    justify-content: flex-start;
`

const SideMenu = styled(NavLink)`
    padding: 12px 16px;
    position: relative;
    width: 100%;
    font-size: 14px;
    color: #fff;

    &:hover{
        color: #ae35f0;
        background-color: #fff;
        font-weight: 500;
    }
`

const SideMenubar = ({setOpenHamburgerMenu, open}) => {
    const dispatch = useDispatch()

    const logoutHandler = async () => {
        setOpenHamburgerMenu(false)
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
  return (
    <SideMenuContainer open={open}>
        <CrossIcon onClick={() => setOpenHamburgerMenu(prev => !prev)} />
        <SideMenus onClick={() => setOpenHamburgerMenu(false)}>
            {sidebarItems.map(item => (  
                <SideMenu key={item.id} to={`/${item.link}`}>{item.text}</SideMenu>
            ))}
            <SideMenu onClick={logoutHandler}>Logout</SideMenu>
        </SideMenus>
    </SideMenuContainer>
  )
}

export default SideMenubar