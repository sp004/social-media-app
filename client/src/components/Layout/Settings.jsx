import React, { useState } from 'react'
import styled from 'styled-components'
import { flexAround } from '../../styles/variables'
import { sidebarItems } from '../../utils'
import UserProfile from '../../components/Settings/UserProfile/UserProfile'
import { useDispatch, useSelector } from 'react-redux'
import AccountSettings from '../../components/Settings/AccountSettings/AccountSettings'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import SettingsSidebar from '../../components/SettingsSidebar/SettingsSidebar'
import BlockedAccounts from '../Settings/BlockedAccounts/BlockedAccounts'
import Bookmarks from '../Settings/Bookmarks/Bookmarks'
import TaggedPosts from '../Settings/TaggedPosts'
import { device } from '../../styles/responsive'

const SettingsContainer = styled.section`
    ${flexAround};
    justify-content: space-between;
    align-items: flex-start !important;
    width: 100%;
    margin: 4rem auto 1rem auto;
`

export const SettingsMainContent = styled.div`
    flex: 0.75;
    margin: 3rem 5rem 0 0;
    color: ${({theme}) => theme.text};

    @media ${device.tablet}{ 
        margin: 1rem 1rem 2.5rem 1rem;
        flex: 1;
    }
`

const Settings = () => {
    // const navigate = useNavigate()
    // const dispatch = useDispatch()
    const path = useLocation().pathname.split('/').splice(-1)[0]
    // const [component, setComponent] = useState(UserProfile)
    const auth = useSelector(state => state?.auth)

    // const openMenuHandler = (index) => {
    //     if(index === 2){
    //         logoutHandler()
    //         return
    //     }
    //     setComponent(sidebarItems[index].Component)
    // }

    // console.log(currentUser)

  return (
    <SettingsContainer>
        <SettingsSidebar />

        <SettingsMainContent>
            {path === 'settings' && <AccountSettings currentUser={auth?.currentUser} />}
            {path === 'profile' && <UserProfile auth={auth} />}
            {path === 'bookmarks' && <Bookmarks />}
            {path === 'tagged-posts' && <TaggedPosts />}
            {path === 'blocked-accounts' && <BlockedAccounts />}
            {/* {component.props.children[0].props.children === 'Account Settings' ? 
            <AccountSettings currentUser={currentUser} navigate={navigate} dispatch={dispatch} /> : 
            <UserProfile currentUser={currentUser} />
            } */}
        </SettingsMainContent>
    </SettingsContainer>
  )
}

export default Settings