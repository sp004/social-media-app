import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import FeedRight from '../../components/FeedRight/FeedRight'
import Navbar from '../../components/Navbar/Navbar'
import Posts from '../../components/Posts/Posts'
import { sendVerificationEmail } from '../../features/auth/authSlice'
import { device } from '../../styles/responsive'
import Meta from '../../components/Meta'
import { Helmet } from 'react-helmet'

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 92%;
  margin: 4rem auto 2rem auto; 

  @media ${device.laptop}{ 
    width: 100%;
  }
`

const Feed = () => {
  // <Meta title='MeetChat - Feed' content={'This is the feed page of the application'} />
  // <Helmet>
  //     <title>Feed</title>
  //     <meta name='description' content='hi bro' />
  //   </Helmet>
  document.title = 'MeetChat - Feed'
  const {currentUser} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const {verificationToken} = useParams()
  console.log(currentUser)

  // useEffect(() => {
  //   if(!currentUser?.isVerified){
  //     console.log("2")
  //     dispatch(sendVerificationEmail())
  //   }
    // else{
    //   dispatch(getProfile())
    // }
  // }, [currentUser])
  

  const verifyUserHandler = async () => {
    console.log("3")
    await dispatch(sendVerificationEmail())
  }

  return (
    <>
      {/* {currentUser?.isVerified 
      ?
      <>
        <Navbar />
        <MainContainer>
          <Posts />
          <FeedRight />
        </MainContainer>
      </>
      : 
      <>
        <Verify>
          <h2>Please verify</h2>
          <button onClick={verifyUserHandler}>Send Verification Link</button>
        </Verify>
      </>} */}

      <MainContainer>
        <Posts />
        <FeedRight />
      </MainContainer>

    </>
  )
}

export default Feed