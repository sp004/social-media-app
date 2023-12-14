import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { EmptyPlaceHolder, flexCol } from '../../../styles/variables'
import { ButtonDiv, Friend, FriendAvatar, FriendDetails, FriendInfo } from '../../Friends/styles'
import { axiosPrivate } from '../../../api/apiRequest'
import Unblock from '../../FriendButtons/Unblock'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ClipLoader } from "react-spinners";

const BlockedAccountWrapper = styled.section`
  width: 100%;
  color: ${({theme}) => theme.text};
  background-color: ${({theme}) => theme.bgTertiary};
  padding: 1rem;
  border-radius: 10px;
`

const BlockedUsers = styled.div`
  ${flexCol};
  gap: 10px;
  margin-top: 12px;

  :not(:last-child){
    border-bottom: 1px solid grey;
  }
`

const BlockedAccounts = () => {
  document.title = 'MeetFrends - Blocked Accounts'
  // const [blockedUsers, setBlockedUsers] = useState([])
  const navigate = useNavigate()

  const fetchBlockedUsers = async () => {
    const {data} = await axiosPrivate.get('/friend/blockedUsers')
    return data?.data
  }

  const { isLoading, error, data: blockedUsers } = useQuery({
    queryKey: ['blockedUser'],
    queryFn: fetchBlockedUsers
  })

  // useEffect(() => {
  //   const fetchBlockUsers = async () => {
  //     try {
  //       const {data} = await axiosPrivate.get('/friend/blockedUsers')
  //       console.log(data)
  //       setBlockedUsers(data.data)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchBlockUsers()
  // }, [])

  // console.log(blockedUsers)

  return (
    <BlockedAccountWrapper>
      {isLoading 
      ?
      <EmptyPlaceHolder>
        <ClipLoader color='#ae35f0' />
      </EmptyPlaceHolder>
      :
      <>
        {blockedUsers?.length > 0 ?
        <>
          <h1>Blocked Users</h1>
          <BlockedUsers>
            {blockedUsers?.map((user, i) => (
              <Friend key={i}>
                <FriendInfo onClick={() => navigate(`/profile/${user?.username}`)}>
                  <FriendAvatar src={user?.profilePic} alt={user?.fullname} />
                  <FriendDetails>
                    <h5>{user?.fullname}</h5>
                    <p style={{fontSize: '12px'}}>{user?.mutualFriends?.length > 0 ? `${user?.mutualFriends?.length} mutual friends` : ''}</p>
                  </FriendDetails>
                </FriendInfo>

                <ButtonDiv>
                  <Unblock user={user} />
                </ButtonDiv>
              </Friend>
            ))}
          </BlockedUsers>
        </>
        :
        <EmptyPlaceHolder>No user is in the blocklist</EmptyPlaceHolder>
        }
      </>
      }
    </BlockedAccountWrapper>
  )
}

export default BlockedAccounts