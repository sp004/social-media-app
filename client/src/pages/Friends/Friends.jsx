import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { flexAround, flexCenter, style } from '../../styles/variables'
import MyFriends from '../../components/Friends/MyFriends/MyFriends'
import FriendRequest from '../../components/Friends/FriendRequest/FriendRequest'
import SentRequest from '../../components/SentRequest/SentRequest'
import { useDispatch, useSelector } from 'react-redux'
import { Counter } from '../../components/Navbar/styles'
import { fetchReceivedRequests } from '../../features/friend/friendSlice'
import { device } from '../../styles/responsive'

const FriendsContainer = styled.section`
  ${flexAround}
  gap: 2rem;
  width: 80%;
  margin: 6rem auto 2rem auto;
  align-items: flex-start;
  
  @media ${device.tablet}{ 
    width: 90%;
    gap: 1rem;
  }
  
  @media ${device.tabletS}{ 
    width: 100%;
    flex-direction: column;
  }
`

const FriendsWrapper = styled.div`
  flex: 0.6;
  background-color: #fff;
  box-shadow: 0px 0px 8px 1px #e9e9e9;

  @media ${device.tabletS}{ 
    width: 90%;
    margin: 0 auto;
  }
`

const FriendTopBar = styled.div`
  width: 100%;
  height: 50px;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.highlight};
  ${flexCenter};
  text-align: center;
`

const TopBarText = styled(NavLink)`
  flex: 1;
  ${flexCenter};
  height: 100%;
  color: #a435f0;

  :nth-child(1){
    border-right: 2px solid #a435f0;
  }
  :nth-child(2){
    border-left: 2px solid #a435f0;
  }

  &.active{
    color: #a435f0;
    border-bottom: 3px solid #a435f0;
    font-weight: 600;
    border: 2px solid #a435f0;
    /* background-color: #fff; */
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
  }

  @media ${device.mobileL}{
    font-size: ${style.mobileText};
  }
`

const Friends = () => {
  document.title = 'MeetChat - Friends'
  const path = useLocation().pathname.split('/').splice(-1)[0]
  const {friendRequestsReceived} = useSelector(state => state.friend)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchReceivedRequests())
  }, [])

  return (
    <FriendsContainer>
      <FriendsWrapper>
        <FriendTopBar>
          <TopBarText to={`/friends`} activeclassname="activeFriendLink">Friends</TopBarText>
          <TopBarText to={`/friend-requests`} activeclassname="activeFriendLink">
            Friend Requests
            {friendRequestsReceived?.length > 0 && <Counter style={{position: 'static', marginLeft: '4px'}}>{friendRequestsReceived?.length}</Counter>}
          </TopBarText>
        </FriendTopBar>

        {path === 'friends' && <MyFriends />}
        {path === 'friend-requests' && <FriendRequest />}
      </FriendsWrapper>

      <SentRequest />

    </FriendsContainer>
  )
}

export default Friends