import React from 'react'
import styled from 'styled-components'
import { flexAround } from '../../styles/variables'
import UserProfile from '../../components/Settings/UserProfile/UserProfile'
import { useSelector } from 'react-redux'
import AccountSettings from '../../components/Settings/AccountSettings/AccountSettings'
import { useLocation } from 'react-router-dom'
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
    const path = useLocation().pathname.split('/').splice(-1)[0]
    const auth = useSelector(state => state?.auth)

  return (
    <SettingsContainer>
        <SettingsSidebar />

        <SettingsMainContent>
            {path === 'settings' && <AccountSettings currentUser={auth?.currentUser} />}
            {path === 'profile' && <UserProfile auth={auth} />}
            {path === 'bookmarks' && <Bookmarks />}
            {path === 'tagged-posts' && <TaggedPosts />}
            {path === 'blocked-accounts' && <BlockedAccounts />}
        </SettingsMainContent>
    </SettingsContainer>
  )
}

export default Settings