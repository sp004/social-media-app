import React, { useContext, useEffect, useRef, useState } from 'react'
import {BsFillEmojiSmileFill} from 'react-icons/bs'
import styled from 'styled-components'
import { axiosPrivate } from '../../api/apiRequest'
import { flexAround, flexBetween, flexCenter, flexCol } from '../../styles/variables'
import { BiSend } from 'react-icons/bi'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import moment from 'moment'
import { MdDelete } from 'react-icons/md'
import { IconHolder } from '../Post/styles'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SocketContext } from '../../context/socketContext'
import { device } from '../../styles/responsive'
import { ThemeContext } from '../../context/themeContext'

const CommentInputSection = styled.div`
    position: relative;
    `

const CommentInputDiv = styled.div`
    ${flexAround};
`

const Emoji = styled.div`
    position: fixed;
    top: 12%;
    left: 13%;
    border: 1px solid black;
    border-radius: 10px;
    z-index: 99;

    @media ${device.mobileL}{
        left: 0;
        min-width: 100vw;
    }
`

const EmojiIcon = styled(BsFillEmojiSmileFill)`
    color: #FFC83D;
    background-color: #000;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
`

const CommentInput = styled.input`
    outline: none;
    border: 1px solid lightgray;
    width: 90%;
    padding-left: 4px;
    font-size: 13px;
    height: 30px;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
    
    ::placeholder{
        color: ${({theme}) => theme.text};
    }
`

const PostComment = styled(BiSend)`
    font-size: 20px;
    cursor: pointer;
`

const CommentWrapper = styled.div`
    background-color: ${({theme}) => theme.bgSecondary};
    ${flexCol}
    gap: 6px;
    padding: 10px 4px 10px 1rem;
    margin-top: 8px;

    @media ${device.mobileL}{
        padding: 12px 6px;
    }
`

const AllComments = styled.div`
    ${flexBetween}
    gap: 4px;
    width: 100%;
`

const CommentAvatar = styled.img`
    height: 30px;
    min-width: 30px;
    border-radius: 50%;
    object-fit: cover;
`

const Content = styled.div`
    ${flexCol}
    align-items: flex-start;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.soft};
    border-radius: 10px;
    padding: 6px;
    
    p{
        font-size: 12px;
        color: ${({theme}) => theme.text};
    }
`

const Comments = ({comments, post}) => {
    const [comment, setComment] = useState('')
    // const [allComments, setAllComments] = useState([])
    // const [currentEmoji, setCurrentEmoji] = useState('')
    const [emojiClicked, setEmojiClicked] = useState(false)
    const emojiRef = useRef()
    const {currentUser} = useSelector(state => state.auth)
    const {socket} = useContext(SocketContext)
    const {darkMode} = useContext(ThemeContext)
    const queryClient = useQueryClient();

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
        setComment(comment + emoji)
        // setCurrentEmoji(e.native)
        setEmojiClicked(prev => !prev)
    }

    const addCommentMutation = useMutation({
        mutationFn: async (commentData) => {
            await axiosPrivate.put(`/comment/add/${post._id}`, commentData)
            setComment('')
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const deleteCommentMutation = useMutation({
        mutationFn: async ({commentId}) => {
            await axiosPrivate.put(`/comment/remove/${post._id}/${commentId}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const postCommentHandler = () => {
        addCommentMutation.mutate({
            message: comment, 
            createdAt: Date.now()
        })
        currentUser?._id !== post?.userId?._id && socket.emit("sentNotification", {
            sender: currentUser?._id,
            receiver: post?.userId?._id,
            type: "comment",
            createdAt: Date.now()
        })
    }

    const commentDeleteHandler = async (commentId) => {
        deleteCommentMutation.mutate({commentId})
    }

  return (
    <CommentInputSection>
        <CommentInputDiv>
            <EmojiIcon onClick={() => setEmojiClicked(prev => !prev)} />
            <CommentInput type='text' name='comment' value={comment} placeholder='Type your comment' onChange={(e) => setComment(e.target.value)} />
            <PostComment onClick={postCommentHandler} /> 
        </CommentInputDiv>
        <Emoji ref={emojiRef}>
            {emojiClicked && <Picker
                data={data} 
                previewPosition='none'
                onEmojiSelect={emojiSelectHandler}
                theme={`${darkMode === true ? 'dark' : 'light'}`}
                emojiSize={18}
            />}
        </Emoji>

        {comments?.length > 0 && <CommentWrapper>
            {comments?.map((comment, i) => (
                <AllComments key={i}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                        <CommentAvatar src={comment?.userId?.profilePic} alt={comment?.userId?.username} />
                        <Content>
                            <p style={{fontWeight: '700'}}>{comment?.userId?.fullname}</p>
                            <p style={{fontWeight: '400', wordBreak: 'break-word'}}>{comment?.message}</p>
                        </Content>
                    </div> 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <p style={{fontSize: '10px', fontWeight: '600', color: 'gray'}}>{moment(comment?.createdAt).fromNow()}</p>
                        {currentUser._id === comment?.userId?._id && <IconHolder onClick={() => commentDeleteHandler(comment?._id)}><MdDelete /></IconHolder> }
                    </div>
                </AllComments>
            ))}
        </CommentWrapper>}
    </CommentInputSection>
  )
}

export default Comments