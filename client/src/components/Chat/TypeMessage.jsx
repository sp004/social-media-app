import React, { useContext, useEffect, useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { BiSend } from 'react-icons/bi'
import styled from 'styled-components'
import { flexAround, flexCenter, style } from '../../styles/variables'
import { BsFillEmojiSmileFill } from 'react-icons/bs'
import { Socket, io } from 'socket.io-client'
import { axiosPrivate } from '../../api/apiRequest'
import { ChatContext } from '../../context/ChatContext'
import { SocketContext } from '../../context/socketContext'
import { device } from '../../styles/responsive'

const TypeSection = styled.div`
    position: relative;
    height: 40px;
    width: 70%;

    @media ${device.tabletS}{
        width: 90%;
    }
`

const InputArea = styled.div`
    ${flexAround};
    height: 100%;
`

const Emoji = styled.div`
    position: fixed;
    top: 28%;
    left: 25%;
    border: 1px solid black;
    border-radius: 10px;
    z-index: 99;
`

const EmojiIcon = styled(BsFillEmojiSmileFill)`
    color: #FFC83D;
    background-color: #000;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
`

const InputMessage = styled.input`
    outline: none;
    width: 100%;
    height: 100%;
    padding: 8px 14px;
    font-size: 13px;
    resize: none;
    margin: 0 4px;
    border-radius: 50px;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
    
    ::placeholder{
        color: ${({theme}) => theme.text};
    }

    @media ${device.mobileL}{
        font-size: ${style.mobileText};
    }
    `

const SendButton = styled.button`
    border-radius: 50%; 
    outline: none;
    border: none;
    height: 30px;
    min-width: 30px;
    ${flexCenter}
    overflow-y: hidden;
`

const SendIcon = styled(BiSend)`
    font-size: 20px;
    cursor: pointer;
    background-color: #e9e9e9;
    padding: 8px;
    font-size: 2.5rem;
    border-radius: 50%;
    /* ${flexCenter} */

    :hover{
        background-color: #ae35f0;
        color: #fff;
    }

    @media ${device.mobileL}{
        font-size: 2rem;
    }
`

const TypeMessage = ({currentUser, msgRef}) => {
    const [emojiClicked, setEmojiClicked] = useState(false)
    // const [typingTimeout, setTypingTimeout] = useState(null)

    const {conversation, setChats, chats} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const emojiRef = useRef()

    const handleClickOutside = (event) => {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
            setEmojiClicked(false);
        }
    }
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    useEffect(() => {
        window.addEventListener('scroll', () => setEmojiClicked(false));

        return () => {
            window.removeEventListener('scroll', () => setEmojiClicked(false));
        };
    }, [])

    const emojiSelectHandler = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach(el => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        msgRef.current.value += emoji
        setEmojiClicked(prev => !prev)
    }

    const handleInput = () => {
        // socket.emit('typing-started')

        // if(typingTimeout) clearTimeout(typingTimeout) //avoid debouncing

        // setTypingTimeout(setTimeout(() => {
        //     socket.emit("typing-stopped");
        // }, 1000));
    }

    const sendMessageHandler = async (e) => {
        e.preventDefault()

        const message = msgRef.current.value
        // setChats(prev => ([...prev, {message, sender: currentUser._id, received: false}]))

        //emitting event to socket server
        socket?.emit('message', {
            conversationId: conversation?._id,
            message: message,
            sender: currentUser._id,
            receiver: conversation?.user?._id
        })

        //send to DB
        try {
            const {data} = await axiosPrivate.post('/message/create', {
                sender: currentUser._id,
                conversationId: conversation?._id,
                message,
                createdAt: Date.now()
            })
            // console.log(data.data)   
            setChats([...chats, data?.data]);
        } catch (error) {
            console.error(error)
            // console.log('Something went wrong, please send message later')
        }

        msgRef.current.value = ''
    }
console.log(conversation)
  return (
    <TypeSection>
        {!currentUser?.isVerified 
        ? 
            <h3 style={{textAlign: 'center', color: 'gray'}}>Please verify your email first</h3>
        :   
            <>
                {conversation?.user?.isDeactivated || !conversation?.user
                ?  
                    <h3 style={{textAlign: 'center', color: 'gray'}}>
                        {conversation?.user ? `${conversation?.user?.fullname}'s account is deactivated` : 'This account is deleted'} 
                    </h3>
                :
                    <>
                        {conversation?.blocked
                        ?
                            <h3 style={{textAlign: 'center', color: 'gray'}}>
                                {`You have blocked ${conversation?.user?.fullname}`}
                            </h3>
                        :
                            <>
                                {conversation?.isBlocked 
                                ?
                                    <h3 style={{textAlign: 'center', color: 'gray'}}>
                                        {`${conversation?.user?.fullname} has blocked you`}
                                    </h3>
                                :
                                    <>
                                        <InputArea>
                                            <EmojiIcon onClick={() => setEmojiClicked(prev => !prev)} />
                                            {/* <InputMessage type='text' name='message' value={message} placeholder='Type your message' onChange={(e) => setMessage(e.target.value)} /> */}
                                            <InputMessage type='text' placeholder='Type your message' ref={msgRef} onChange={handleInput} onKeyDown={(event) => {
                                                if(event.key === 'Enter'){
                                                    sendMessageHandler(event)
                                                }
                                            }} />
                                            <SendButton onClick={sendMessageHandler}>
                                                <SendIcon />
                                            </SendButton>
                                        </InputArea>
                                        <Emoji ref={emojiRef}>
                                            {emojiClicked && <Picker
                                                data={data} 
                                                previewPosition='none'
                                                onEmojiSelect={emojiSelectHandler}
                                                theme='light'
                                                emojiSize={18}
                                            />}
                                        </Emoji>
                                    </>
                                }
                            </>
                        }
                    </>
                }
            </>
        }
    </TypeSection>
  )
}

export default TypeMessage