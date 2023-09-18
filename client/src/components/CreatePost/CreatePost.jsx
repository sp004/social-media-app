import React, { useContext, useState } from 'react'
import CreatePostModal from '../CreatePostModal/CreatePostModal'
import { Avatar, CreatePostWrapper, InputRow, InputText, OnlineUserAvatar, OnlineUserHeading, OnlineUserName, OnlineUsersTablet, OnlineUsersWrapper } from './styles'
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/socketContext'

const CreatePost = () => {
  const [openCreatePost, setOpenCreatePost] = useState(false)
  const {currentUser} = useSelector(state => state.auth)
  const {onlineUsers} = useContext(SocketContext)

  return (
    <CreatePostWrapper>
        <OnlineUsersTablet>
          <OnlineUserHeading>Active Now</OnlineUserHeading>
          <OnlineUsersWrapper>
            {onlineUsers?.length > 0 && 
              <>
                {onlineUsers.map((user, i) => (
                  <div key={i}>
                      <OnlineUserAvatar key={user?._id} src={user?.profilePic} alt={user?.fullname} />
                      <OnlineUserName>{user?.fullname}</OnlineUserName>
                  </div>
                ))}
              </>
            }
            
          </OnlineUsersWrapper>
        </OnlineUsersTablet>
        <InputRow>
            <Avatar src={currentUser?.profilePic} alt={currentUser?.fullname} />
            <InputText placeholder='Create your post' onClick={() => setOpenCreatePost(true)} />
            {openCreatePost && <CreatePostModal openModal={setOpenCreatePost} formType='Create Post' />}
        </InputRow>
    </CreatePostWrapper>
  )
}

export default CreatePost