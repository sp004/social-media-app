import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TypeMessage from "../TypeMessage";
import Message from "../Message";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { ChatContext } from "../../../context/ChatContext";
import { EmptyPlaceHolder, flexCenter } from "../../../styles/variables";
import { SocketContext } from "../../../context/socketContext";
import { device } from "../../../styles/responsive";
import { BsArrowLeftCircleFill } from "react-icons/bs";

const ChatContentWrapper = styled.div`
  flex: 0.75;
  padding-bottom: 5rem;
  position: relative;
  /* margin-bottom: 2rem; */

  @media ${device.tabletS}{
    flex: ${(props) => props.isSelected ? 1 : 0};
  }
`;

const BackArrow = styled.div`
  padding-left: 1rem;
  position: fixed;
  top: 10%;
  height: 40px;
  background-color: ${({theme}) => theme.bgTertiary};
  cursor: pointer;
  width: 100%;
  display: none;
  
  svg{
    color: #ae35f0;
    border-radius: 50%;
    font-size: 1.2rem;
  }

  p{
    font-size: 1rem;
    font-weight: 600;
    color: ${({theme}) => theme.text};
  }
  
  @media ${device.tabletS}{
    ${flexCenter}
    justify-content: flex-start;
    gap: 1rem;
    /* display: block; */
  }
`

const MessagesContainer = styled.div`
  width: 90%;
  margin: 2rem auto 0;
  height: 550px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  
  @media ${device.tabletS}{
    height: 400px;
    margin: 3rem auto 0;
  }
`;

const MessageInput = styled.div`
  position: fixed;
  width: 90%;
  bottom: 0;
  padding: 2rem 1rem;
  
  @media ${device.tabletS}{
    width: 100%;
    padding: 4rem 0;
  }
`;

const ChatContent = () => {
  const msgRef = useRef();
  const scrollRef = useRef()
  const [newMessage, setNewMessage] = useState(null);
  const [typing, setTyping] = useState(false)
  const { currentUser } = useSelector((state) => state.auth);
  const {chats, setChats, conversation, setConversation} = useContext(ChatContext)  
  const {socket} = useContext(SocketContext)
  // const selectedConversation = conversation
  
  //establish socket connection
  // useEffect(() => {
    // console.log("connecting to socket...");
    // setSocket(() => io(import.meta.env.VITE_APP_SOCKET_URL));
    
    // setChats([])

    // return () => io(import.meta.env.VITE_APP_SOCKET_URL).close();
  // }, []);
// console.log("socket ===>", socket?.id)

// receive message
useEffect(() => {
  if (!socket) return;

  socket?.on("sentMessage", (newChat) => {
    setNewMessage({
      conversationId: newChat.conversationId,
      sender: newChat.sender,
      message: newChat.message,
      createdAt: Date.now()
    })
  })
}, [socket])

  useEffect(() => {
    // newMessage && conversation?.users?.some(user => user._id === newMessage.sender) && setChats(prev => [...prev, newMessage])
    setChats(prev => [...prev, newMessage])
  }, [newMessage, conversation])

  //scroll to end of the chat window
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [chats])
  
  const goPrevHandler = () => {
    setConversation({})
  }

  // when user becomes online 
  // useEffect(() => {
  //   if(!socket) return 

  //   socket.emit("user-online", currentUser._id)
  //   socket.on("get-online-users", users => {
  //     console.log("users", users)
  //   })
  // }, [currentUser])

  // useEffect(() => {
  //   if (!socket) return;
    
  //   const handleNewChat = (newChat) => {
  //     setChats(prev => [...prev, newChat])

  //     if (!conversation?._id || conversation?._id !== newChat.conversationId) {
  //     }
  //     else {
  //       setChats(prev => [...prev, newChat])
  //     }
  //   };

  //   socket.on("send-from-server", handleNewChat);
  //   socket.on("typing-started-server", () => setTyping(true));
  //   socket.on("typing-stopped-server", () => setTyping(false));

  //   socket.on("send-from-server", (newChat) => {
  //     if(!conversation || conversation._id !== newChat.conversationId){
  //     }else{
  //       setChats(prev => [...prev, newChat])
  //     }
  //   });

  //   socket.on("typing-started-server", () => setTyping(true));
  //   socket.on("typing-stopped-server", () => setTyping(false));
  // },[socket]);

  return (
    <ChatContentWrapper isSelected={Object.keys(conversation).length ? true : false}>
      <BackArrow>
        <BsArrowLeftCircleFill onClick={goPrevHandler} />
        <p>{conversation?.user?.fullname}</p>
      </BackArrow>
      <MessagesContainer>
        {
          (Object.keys(conversation).length) ?
          (
            <>
            {!chats.filter(Boolean).length ? 
              <EmptyPlaceHolder>Start conversation with {conversation?.user?.fullname}</EmptyPlaceHolder>
            : 
              <>
                {chats?.map((item, i) => (
                  <div key={i} ref={scrollRef}>
                    <Message data={item} />
                  </div>
                ))} 
              </>
            }

              <MessageInput>
                {/* {typing && <p style={{fontSize: '12px', color: 'gray'}}>Typing...</p>} */}
                {typing && 
                  <BeatLoader
                    color='#ae35f0'
                    size={10}
                  />
                }
                <TypeMessage socket={socket} msgRef={msgRef} currentUser={currentUser} setTyping={setTyping} />
              </MessageInput>
            </>
          ) : (
            <EmptyPlaceHolder>
              Start Conversation
            </EmptyPlaceHolder>
          )
        }
      </MessagesContainer>

    </ChatContentWrapper>
  );
};

export default ChatContent;
