import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchSentFriendRequests } from '../../features/friend/friendSlice'
import { EmptyPlaceHolder, borderedButton, button, flexAround, flexBetween, flexCenter, flexCol } from '../../styles/variables'
import { axiosPrivate } from '../../api/apiRequest'
import { useNavigate } from 'react-router-dom'
import CancelRequest from '../FriendButtons/CancelRequest'
import { ButtonDiv, Friend, FriendAvatar, FriendDetails, FriendInfo } from '../Friends/styles'
import { device } from '../../styles/responsive'

const ReqSentWrapper = styled.div`
  flex: 0.3;
  width: 100%;
  height: 33%;
  background-color: ${({theme}) => theme.bgSecondary};
  color: ${({theme}) => theme.text};
  padding: 12px;

  @media ${device.laptop}{ 
    flex: 0.4;
  }

  @media ${device.tabletS}{ 
    width: 90%;
    margin: 0 auto;
    margin-bottom: 3.5rem;
  }
`

const Friends = styled.div`
  ${flexCol}
  margin-top: 10px;
`

const SentRequest = () => {
  const dispatch = useDispatch()
  const {friendRequestsSent} = useSelector(state => state.friend)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchSentFriendRequests())
  }, [])

  return (
    <ReqSentWrapper>
        <h4>Sent Requests</h4>
        {
          friendRequestsSent?.length > 0
          ?
            <Friends>
              {friendRequestsSent?.map((user, i) => (
                <Friend key={i}>
                  <FriendInfo onClick={() => navigate(`/profile/${user?.username}`)}>
                    <FriendAvatar src={user?.profilePic} alt={user?.fullname} />
                    <FriendDetails>
                      <h5>{user?.fullname}</h5>
                      <p style={{fontSize: '12px'}}>{user?.mutualFriends?.length > 0 ? `${user?.mutualFriends?.length} mutual friends` : ''}</p>
                    </FriendDetails>
                  </FriendInfo>

                  {!user?.isDeactivated && <ButtonDiv>
                    <CancelRequest user={user} sidebar='sidebar' />
                    {/* <FriendStatusButton onClick={() => withdrawRequestHandler(user?._id)}>Cancel Request</FriendStatusButton> */}
                  </ButtonDiv>}
                </Friend>
              ))}
            </Friends>
          :
            <EmptyPlaceHolder style={{height: '15vh', fontSize: '1.2rem', textAlign: 'center'}}>You have not sent any request</EmptyPlaceHolder>
        }
    </ReqSentWrapper>
  )
}

export default SentRequest