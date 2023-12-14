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
  margin: 4rem auto 2rem; 

  @media ${device.laptop}{ 
    width: 100%;
  }
`

const Feed = () => {
  document.title = 'MeetFrends - Feed'
  const dispatch = useDispatch()
  const {verificationToken} = useParams()
  // console.log(currentUser)

  // const verifyUserHandler = async () => {
  //   await dispatch(sendVerificationEmail())
  // }

  return (
    <>
      <MainContainer>
        <Posts />
        <FeedRight />
      </MainContainer>
    </>
  )
}

export default Feed