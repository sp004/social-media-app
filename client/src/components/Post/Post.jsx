import { forwardRef, useContext, useEffect, useState } from 'react'
import { Avatar, PostAuthor, PostAuthorInfo, PostBottomAction, PostBottomRow, PostContainer, PostImage, PostInfo, PostText, PostTimeago, PostTopRow, TaggedUser, IconHolder, PostActionButton } from './styles'
import SocialMediaModal from '../SocialMediaModal/SocialMediaModal'
import Comments from '../Comment/Comments'
import moment from 'moment'
import { useLocation, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { MdDelete, MdOutlineEdit } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { axiosPrivate } from '../../api/apiRequest'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { RiShareFill } from 'react-icons/ri'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CreatePostModal from '../CreatePostModal/CreatePostModal'
import { SocketContext } from '../../context/socketContext'

const Post = forwardRef(({post}, ref) => {
    const {currentUser, isLoggedIn} = useSelector(state => state.auth)
    const [openComment, setOpenComment] = useState(false)
    const [openShareModal, setOpenShareModal] = useState(false)
    const [openUpdatePostModal, setOpenUpdatePostModal] = useState(false)
    const {socket} = useContext(SocketContext)
    const navigate = useNavigate()
    const sharedPostId = useLocation().pathname.split('/')[1]

    const queryClient = useQueryClient();

    // Sanitize the post content to remove any potentially dangerous content
    const sanitizedText = DOMPurify.sanitize(post?.content || '');
    const textWithLineBreaks = sanitizedText.replace(/\n/g, '<br>');
    const formattedText = textWithLineBreaks.replace(/(#\w+)/g, '<b style="color: #ae35f0;">$1</b>');

    const addBookmarkMutation = useMutation({
        mutationFn: async () => {
          return await axiosPrivate.post(`/bookmark/add/${post._id}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const removeBookmarkMutation = useMutation({
        mutationFn: async () => {
          return await axiosPrivate.put(`/bookmark/remove/${post._id}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const likeMutation = useMutation({
        mutationFn: async () => {
            console.log("🤐liked bro.....")
          return await axiosPrivate.put(`/post/like/${post._id}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const removeLikeMutation = useMutation({
        mutationFn: async () => {
            console.log("🤐disliked bro.....")
          return await axiosPrivate.put(`/post/dislike/${post._id}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    //-------------- emit notifications ----------------
    const likeHandler = async (post) => {
        likeMutation.mutate()
        currentUser?._id !== post?.userId?._id && socket.emit("sentNotification", {
            sender: currentUser?._id,
            receiver: post?.userId?._id,
            type: "like",
            createdAt: Date.now()
        })
    }

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await axiosPrivate.delete(`/post/delete/${post?._id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            queryClient.invalidateQueries({ queryKey: ['hashtags'] })
        },
    })

    const deletePostHandler = async () => {
        deleteMutation.mutate()
    }


    const postBody = (
        <>
            <PostTopRow>
                <PostAuthorInfo onClick={() => navigate(`/profile/${post?.userId?.username}`)}>
                    <Avatar src={post?.userId?.profilePic} alt={post?.userId?.username} />
                    <PostInfo>
                        <PostAuthor>{post?.userId?.fullname}</PostAuthor>
                        <PostTimeago>
                            {moment(post?.createdAt).format("DD/MM/YYYY HH:mm:ss")} {" "}
                            {post?.isEdited && <span>(edited)</span>}
                        </PostTimeago>
                    </PostInfo>
                </PostAuthorInfo>

                <>
                    {isLoggedIn && 
                        <>
                            {currentUser._id !== post?.userId?._id
                            ? <PostActionButton>
                                <IconHolder>
                                    {post?.bookmarkedBy?.includes(currentUser._id) 
                                        ? <FaBookmark onClick={() => removeBookmarkMutation.mutate()} title='Bookmarked'/>
                                        : <FaRegBookmark onClick={() => addBookmarkMutation.mutate()} title='Add to Bookmark' />
                                    }                       
                                </IconHolder>              
                            </PostActionButton>
                            : <PostActionButton>
                                <IconHolder onClick={() => setOpenUpdatePostModal(true)}><MdOutlineEdit /></IconHolder>
                                <IconHolder onClick={deletePostHandler}><MdDelete /></IconHolder>
                            </PostActionButton>
                            }
                        </>
                    }
                </>
                {openUpdatePostModal && 
                <CreatePostModal openModal={setOpenUpdatePostModal} formType='Update' postToEdit={post} />}
            </PostTopRow>

            <PostText dangerouslySetInnerHTML={{ __html: formattedText }} />

            {post?.taggedUsers?.map((user, i) => (
                <TaggedUser key={i} onClick={() => sharedPostId !== 'shared-post' && navigate(`/profile/${user?.username}`)} title={`${user?.fullname}(${user?.username})`}>{user.fullname}</TaggedUser>
            ))}

            {post?.image && <PostImage src={post?.image} alt={post._id} />}

            {isLoggedIn && <PostBottomRow>
                <PostBottomAction>
                    {post?.likedUserIds?.includes(currentUser._id) 
                        ? <AiFillLike onClick={() => removeLikeMutation.mutate()} style={{color: '#ae35f0'}} />
                        : <AiOutlineLike onClick={() => likeHandler(post)} />
                    }                       
                    <span>{post?.likedUserIds?.length > 0 && post?.likedUserIds?.length} {post?.likedUserIds?.length > 1 ? 'Likes' : 'Like'}</span>
                </PostBottomAction>
                <PostBottomAction onClick={() => setOpenComment(prev => !prev)}>
                    <BiCommentDetail />
                    <span>{post?.comments?.length > 0 && post?.comments?.length} {post?.comments?.length > 1 ? 'Comments' : 'Comment'}</span>
                </PostBottomAction>
                <PostBottomAction onClick={() => setOpenShareModal(true)}>
                    <RiShareFill />
                    <span>{post?.sharedBy?.length > 0 && post?.sharedBy?.length} {post?.sharedBy?.length > 1 ? 'Shares' : 'Share'}</span>
                </PostBottomAction>
                {openShareModal && <SocialMediaModal openModal={openShareModal} setOpenModal={setOpenShareModal} post={post} />}
            </PostBottomRow>}
            {isLoggedIn && openComment && <Comments comments={post?.comments} post={post} />}
        </>
    )
    
  return (
    <>
        {
            ref
            ? <PostContainer ref={ref}>{postBody}</PostContainer>
            : <PostContainer>{postBody}</PostContainer>
        }
    </>
  )
})

// export const ForwardedPost = forwardRef(Post);
export default Post