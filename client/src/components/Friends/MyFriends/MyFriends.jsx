import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFriends } from '../../../features/friend/friendSlice'
import { ButtonDiv, Friend, FriendAvatar, FriendDetails, FriendInfo, FriendsDiv } from '../styles'
import Unfriend from '../../FriendButtons/Unfriend'
import Block from '../../FriendButtons/Block'
import { useNavigate } from 'react-router-dom'


const MyFriends = () => {
  const {friends} = useSelector(state => state.friend)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchFriends())
  }, [])

  return (
    <>
      {friends?.length > 0 ?
      <FriendsDiv>
        {friends?.map((user, i) => (
          <Friend key={i}>
            <FriendInfo onClick={() => navigate(`/profile/${user?.username}`)}>
              <FriendAvatar src={user?.profilePic} alt={user?.fullname} />
              <FriendDetails>
                <h5>{user?.fullname}</h5>
                <p>{user?.mutualFriends?.length > 0 ? `${user?.mutualFriends?.length} mutual friends` : ''}</p>
              </FriendDetails>
            </FriendInfo>
            {!user?.isDeactivated && <ButtonDiv>
              <Unfriend user={user} />
            </ButtonDiv>}
          </Friend>
        ))}
      </FriendsDiv>
      : (
        <FriendsDiv style={{height: '60vh', color: 'lightgrey'}}>
          <h1>You have no friends</h1>
        </FriendsDiv>
      )}
    </>
  )
}

export default MyFriends