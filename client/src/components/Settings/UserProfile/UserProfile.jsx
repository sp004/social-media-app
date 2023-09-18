import React, { useEffect, useState } from 'react'
import { ProfilePicContainer, ProfileImage } from '../../ProfileHeader/styles'
import styled, { css } from 'styled-components'
import { button, flexCenter, flexCol, style } from '../../../styles/variables'
import { axiosPrivate } from '../../../api/apiRequest'
import {FcOk} from 'react-icons/fc'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { reset, updateUser } from '../../../features/auth/authSlice'
import { device } from '../../../styles/responsive'
import { toast } from 'react-hot-toast'

const ProfileWrapper = styled.div`
  ${flexCol}
  margin-top: 2rem;
  gap: 1rem;
  align-items: flex-start;

  @media ${device.tabletS}{ 
    margin-bottom: 2.5rem;
  }
`

const EditButton = styled.button`
  border: 2px solid #a435f0;
  padding: 4px 6px;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 1rem 0;
  font-weight: 600;
  cursor: pointer;
`

const ProfileLabel = styled.label`
  font-weight: 600;

  @media ${device.tabletS}{ 
    font-size: ${style.mobileText}
  }
`

const ProfileInput = styled.input`
  outline: none;
  border: none;
  background: transparent;
  font-size: 14px;
  margin-left: 10px;
  padding: 0 4px;
  color: ${({theme}) => theme.text};

  ${props => props.editable && css`
    border: 1px solid black;
    background-color: ${({theme}) => theme.bgTertiary};
  `}

  @media ${device.tabletS}{ 
    font-size: ${style.mobileText}
  }
`

const StatusContainer = styled.div`
  ${flexCenter};
  align-items: flex-start;
  gap: 1rem;
`

const Status = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 80px;
  outline: none;
  border: none;
  padding: 4px;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.text};

  ${props => props.editable && css`
    border: 1px solid black;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
  `}

  @media ${device.tabletS}{ 
    width: auto;
    font-size: ${style.mobileText};
  }
`

const UpdateButton = styled.button`
  ${button}
`

const UserProfile = ({auth}) => {
  document.title = 'MeetChat - Edit Profile'
  const {currentUser, message: msg, isSuccess, isLoading} = auth || {}

  const [status, setStatus] = useState(currentUser?.status ?? '')
  const [fullname, setFullname] = useState(currentUser?.fullname)
  const [editable, setEditable] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()

  const maxCharacterCount = 60;
  const remainingCharacterCount = maxCharacterCount - parseInt(status?.length);

  const updateProfileHandler = async () => {
    if(currentUser?.username === 'test'){
      alert("You can't edit Fullname and Status of 'test' profile. Please try this feature from own account.")
      return
    }
    await dispatch(updateUser({...currentUser, status, fullname}))
    await dispatch(reset())
    
    if(isSuccess && !isLoading){
      setEditable(false)
      toast.success('Profile updated successfully')
    }
  }

  // useEffect(() => {
  //   if(isSuccess && !isLoading){
  //     toast.success('Profile updated successfully')
      // setMessage(msg)
      // setTimeout(() => {
      //   setMessage('')
      // }, 3000);
    // }
  // }, [isSuccess, message, isLoading])

  return (
    <>
      <h1>User Profile</h1>

      <EditButton onClick={() => {
        if(!currentUser?.isVerified){
          toast.error('You are not verified yet')
          return
        } 
        setEditable(prev => !prev)
      }}>
        {!editable ?
        <>
          <MdOutlineModeEditOutline /> Edit
        </> : 
        <span style={{color: 'red'}}>Cancel</span>}
      </EditButton>

      <ProfileWrapper>
        <ProfilePicContainer style={{margin: 0}}>
          <ProfileImage src={currentUser?.profilePic} alt={currentUser?.fullname} />
        </ProfilePicContainer>
        <div>
          <ProfileLabel>FullName</ProfileLabel>
          <ProfileInput type="text" value={fullname} name='fullname' onChange={(e) => setFullname(e.target.value)} readOnly={!editable ? true : false} style={{textTransform: 'capitalize'}} editable={editable} />
        </div>
        <div>
          <ProfileLabel>Email</ProfileLabel>
          <ProfileInput type="text" defaultValue={currentUser?.email} readOnly />
        </div>
        <div>
          <ProfileLabel>Username</ProfileLabel>
          <ProfileInput type="text" defaultValue={currentUser?.username} readOnly />
        </div>
        <StatusContainer>
          <ProfileLabel>Status</ProfileLabel>
          <div>
            <Status name="status" onChange={(e) => setStatus(e.target.value)} value={status} cols={30} maxLength={60} readOnly={!editable ? true : false} editable={editable}></Status><br />
            {editable ? 
              remainingCharacterCount > 0
                ? <p style={{color: '#54ad54', fontSize: '13px'}}>{remainingCharacterCount} characters left</p>
                : <p style={{color: 'red', fontSize: '13px'}}>0 character left</p>
              : <p></p>}
            {/* <sub>{remainingCharacterCount > 0 ? `${remainingCharacterCount} characters left` : "That's it..."}</sub> */}
          </div>
        </StatusContainer>

        {editable && <UpdateButton onClick={() => updateProfileHandler()}>Update</UpdateButton>}
        {message && <sub style={{color: '#54ad54', background: '#fff', padding: '4px 8px'}}><FcOk /> {message}</sub>}
        {error && <sub style={{color: 'red', background: '#fff', padding: '4px 8px'}}>{error}</sub>}
      </ProfileWrapper>
    </>
  )
}

export default UserProfile