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
  margin: 4rem auto 2rem auto;
`

const Chat = () => {
  // <Meta title={"MeetChat - Chat"} />
  document.title = 'MeetChat - Chat'
  // const {state: user} = useLocation()
  // const [selectedConversation, setSelectedConversation] = useState()
  // const [reFetch, setReFetch] = useState(true)
  // const {setConversation} = useContext(ChatContext)
  // const socket = io('http://localhost:8000')
  // console.log(socket)

  // useEffect(() => {
  //   setConversation({})
  // }, [])

  return (
    <ChatContainer>
      <ChatSidebar />
      <ChatContent />
    </ChatContainer>
  )
}

export default Chat