import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import ChatSidebar from '../../components/Chat/ChatSidebar/ChatSidebar'
import ChatContent from '../../components/Chat/ChatContent/ChatContent'
import { useLocation } from 'react-router-dom'
import { ChatContext } from '../../context/ChatContext'
import Meta from '../../components/Meta'
// import { io } from 'socket.io-client'

const ChatContainer = styled.section`
  display: flex;
  /* height: 100%; */
  margin: 4rem auto 0;
`

const Chat = () => {
  // <Meta title={"MeetFrends - Chat"} />
  document.title = 'MeetFrends - Chat'

  return (
    <ChatContainer>
      <ChatSidebar />
      <ChatContent />
    </ChatContainer>
  )
}

export default Chat