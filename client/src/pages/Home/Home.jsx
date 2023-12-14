import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Login, SignupForm } from '../../components'
import { flexAround, flexCenter } from '../../styles/variables'
import authImage from '../../assets/auth_image.png'
import { device } from '../../styles/responsive'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

const Container = styled.div`
  ${flexAround}
  width: 60%;
  /* padding: 0 10rem; */
  gap: 2rem;
  margin: 0 auto;
  max-width: 100vw;
  min-height: 100vh;
  background-color: ${({theme}) => theme.bgPrimary};
  color: ${({theme}) => theme.text};

  @media ${device.laptop}{
    width: 80%;
  }

  @media ${device.tabletS} {
    width: 90%;
    margin: 0 auto;
  }
`

const Intro = styled.div`
  width: 50%;
  text-align: center;

  h1{
    font-size: 2rem;
  }

  @media ${device.tabletS}{
    display: none;
  }
`

const AuthImage = styled.img`
  width: 100%;
  height: fit-content;
  object-fit: cover;
`

const FromWrapper = styled.div`
  width: 60%;
  /* padding: 0 5rem; */

  @media ${device.tabletS}{
    width: 90%;
  }

  @media ${device.mobileM}{
    width: 100%;
  }
`

const Home = () => {
  const [loginVisible, setloginVisible] = useState(true)

  return (
    <Container>
      <Intro>
        <h1>Welcome To MateChat</h1>
        <p>Union of Your Old friends, make new ones, Chat & Video Call with them.</p>
        <AuthImage src={authImage} alt="image" />
      </Intro>
      <FromWrapper>
        {loginVisible 
          ? <Login setVisibility={setloginVisible}  />
          : <SignupForm setVisibility={setloginVisible} />
        }
      </FromWrapper>
    </Container>
  )
}

export default Home