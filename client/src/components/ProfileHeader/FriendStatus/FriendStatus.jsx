import React from 'react'
import { FriendActions } from '../styles'
import { useSelector } from 'react-redux'
import AddFriend from '../../FriendButtons/AddFriend'
import Accept from '../../FriendButtons/Accept'
import Reject from '../../FriendButtons/Reject'
import Unfriend from '../../FriendButtons/Unfriend'
import Block from '../../FriendButtons/Block'
import CancelRequest from '../../FriendButtons/CancelRequest'
import { useNavigate } from 'react-router-dom'

const FriendStatus = ({isMyProfile, user}) => {

  return (
    <>
        {!isMyProfile && 
        <FriendActions>
            {user?.checkStatus === '' && 
            <>
                <AddFriend user={user} />
                <Block user={user} />
            </>
            }
            {user?.checkStatus === 'Request sent' && 
            <>
                <CancelRequest user={user} sidebar='main' />
            </>
            }
            {user?.checkStatus === 'Request received' && 
            <>
                <Accept user={user} />
                <Reject user={user} />
            </>
            }
            {user?.checkStatus === 'Friend' && 
            <>
                <Unfriend user={user} />
            </>
            }
        </FriendActions>}
    </>
  )
}

export default FriendStatus