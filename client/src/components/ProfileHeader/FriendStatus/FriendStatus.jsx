import React, { useEffect, useState } from 'react'
import { FriendActionButton, FriendActions } from '../styles'
import { useDispatch, useSelector } from 'react-redux'
import AddFriend from '../../FriendButtons/AddFriend'
import Accept from '../../FriendButtons/Accept'
import Reject from '../../FriendButtons/Reject'
import Unfriend from '../../FriendButtons/Unfriend'
import Block from '../../FriendButtons/Block'
import CancelRequest from '../../FriendButtons/CancelRequest'
import styled from 'styled-components'
import { button } from '../../../styles/variables'
import { useNavigate } from 'react-router-dom'
// import { sentFriendRequest } from '../../../features/friend/friendSlice'

const FriendStatus = ({isMyProfile, user}) => {
    const navigate = useNavigate()
    const friend = useSelector(state => state.friend)

    // useEffect(() => {
    //   const check = async () => {
    //     try {
    //         const {data} = await axiosPrivate.get(`/friend//checkFriendshipStatus/${user?._id}`)
    //         console.log(data.status)
    //     } catch (error) {
    //         console.log(error)
    //     }
    //   }
    // }, [])
    
    // console.log(friend)

  return (
    <>
        {!isMyProfile && 
        <FriendActions>
            {user?.checkStatus === '' && 
            <>
                <AddFriend user={user} />
                <Block user={user} />
                {/* <ChatButton onClick={() => navigate('/chat', {state: user})}>Chat</ChatButton> */}
            </>
            }
            {user?.checkStatus === 'Request sent' && 
            <>
                <CancelRequest user={user} sidebar='main' />
                {/* <ChatButton onClick={() => navigate('/chat', {state: user})}>Chat</ChatButton> */}
            </>
            }
            {user?.checkStatus === 'Request received' && 
            <>
                <Accept user={user} />
                <Reject user={user} />
                {/* <ChatButton onClick={() => navigate('/chat', {state: user})}>Chat</ChatButton> */}
            </>
            }
            {user?.checkStatus === 'Friend' && 
            <>
                <Unfriend user={user} />
                {/* <ChatButton onClick={() => navigate('/chat', {state: user})}>Chat</ChatButton> */}
            </>
            }
        </FriendActions>}
    </>
  )
}

export default FriendStatus