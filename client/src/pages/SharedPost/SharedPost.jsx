import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Post from '../../components/Post/Post'
import { ClipLoader } from "react-spinners";
import { useQuery } from '@tanstack/react-query'
import { EmptyPlaceHolder } from '../../styles/variables'
import { device } from '../../styles/responsive'
import { useSelector } from 'react-redux'

const SharePostContainer = styled.section`
  width: 50%;
  margin: 6rem auto 2rem auto;
  background-color: ${({theme}) => theme.bgPrimary};

  @media ${device.tablet}{
    width: 80%;
  }

  @media ${device.mobileL}{
    width: 90%;
  }
`

const SharedPost = () => {
  document.title = 'MeetChat - Shared Post'
  // const [sharedPost, setSharedPost] = useState([])
  const {currentUser} = useSelector(state => state.auth)
  const postId = useLocation().pathname.split('/')[2]

  const fetchSharedPost = async () => {
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/post/find/${postId}`, {loggedinId: currentUser._id});
    return data?.data
  }

  const { isLoading, error, data: sharedPost } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchSharedPost
  })

  // useEffect(() => {
  //   const fetchSharedPost = async () => {
  //     try {
  //       const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/post/find/${postId}`);
  //       setSharedPost(data?.data)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchSharedPost()
  // }, [])
console.log("---------------", sharedPost)
  const isBlockedBy = sharedPost?.userId?.blockedUsers?.includes(currentUser?._id)
  console.log(isBlockedBy)
  return (
    <>
      <SharePostContainer>
        {isLoading
        ?
        <EmptyPlaceHolder>
          <ClipLoader color='#ae35f0' />
        </EmptyPlaceHolder>
        :
        <>
          {isBlockedBy 
          ?
          <EmptyPlaceHolder>
            You can't see {sharedPost?.userId?.fullname}'s post
          </EmptyPlaceHolder>
          :
          <>
            {sharedPost && Object?.keys(sharedPost)?.length > 0 
            ? 
              <Post post={sharedPost} />
            :
              <EmptyPlaceHolder>Oops, no post found!!!</EmptyPlaceHolder>
            }
          </>
          }
        </>
        }
      </SharePostContainer>
    </>
  )
}

export default SharedPost