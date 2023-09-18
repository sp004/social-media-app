import React from 'react'
import { sidebarItems } from '../../utils'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { device } from '../../styles/responsive'
import { style } from '../../styles/variables'

const SettingsSideBar = styled.div`
    flex: 0.2;
    height: fit-content;
    border-right: 4px solid grey;
    min-height: calc(100vh - 60px);
    background-color: ${({theme}) => theme.bgSecondary};
    
    @media ${device.tablet}{ 
        flex: 0.3;
    }
    
    @media ${device.tabletS}{ 
        display: none;
    }
`

const LeftBarWrapper = styled.div`
    width: 100%;
    height: 50px;
    border-bottom: 1px solid grey;

    &:hover{
        background-color: #e4e4e4;
    }
`

const SideMenuLink = styled(NavLink)`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-left: 1rem;
    font-size: 13px;
    cursor: pointer;
    color: ${({theme}) => theme.text};

    &:hover{
        color: #A435F0
    }

    &.active {
        color: #A435F0;
        font-weight: 600;
        border-left: 5px solid #A435F0;
    }

    @media ${device.tablet}{ 
        font-size: ${style.mobileText};
    }
`

const SettingsSidebar = () => {

  return (
    <SettingsSideBar>
        {sidebarItems.map((item, i) => (  
            <LeftBarWrapper key={i}>
                <SideMenuLink to={`/${item.link}`} activeclassname="selectedLink">{item.text}</SideMenuLink>
            </LeftBarWrapper>
        ))}
    </SettingsSideBar>
  )
}

export default SettingsSidebar