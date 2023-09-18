import React, { useContext, useEffect } from 'react'
import { ProfileInfo, ProfileInfoDiv } from '../styles'
import styled from 'styled-components'
import { FcSettings } from 'react-icons/fc'
import { BiChat } from 'react-icons/bi'
import { axiosPrivate } from '../../../api/apiRequest'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../../context/ChatContext'
import { useDispatch, useSelector } from 'react-redux'
import useChat from '../../../hooks/useChat'

const ChatIcon = styled(BiChat)`
    font-size: 1.5rem;
    color: #ae35f0;
`

const OtherInfo = ({user, isMyProfile, posts}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onChatClicked = useChat()
    const {allConversations} = useContext(ChatContext)
    const {friends} = useSelector(state => state.friend)
    console.log("😋😋😋", allConversations)

    // const totalFriends = isMyProfile ? friends?.length : user?.friends?.length

  return (
    <ProfileInfo>
        <ProfileInfoDiv>
            <span>{posts?.length}</span>
            <p>{posts?.length > 1 ? 'Posts' : 'Post'}</p>
        </ProfileInfoDiv>
        <ProfileInfoDiv>
            <span>{user?.friends?.length}</span>
            <p>{user?.friends?.length > 1 ? 'Friends' : 'Friend'}</p>
        </ProfileInfoDiv>
        {isMyProfile 
        ? <ProfileInfoDiv onClick={() => navigate('/settings')}> 
            <FcSettings />
            <p>Settings</p>
        </ProfileInfoDiv>
        : <ProfileInfoDiv onClick={() => onChatClicked(user)}>
            <ChatIcon />
            <p>Chat</p>
        </ProfileInfoDiv>
        }
    </ProfileInfo>
  )
}

export default OtherInfo