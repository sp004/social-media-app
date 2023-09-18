import React from 'react'
import OnLineFriends from '../OnlineFriends/OnLineFriends'
import PopularHashtags from '../PopularHashtags/PopularHashtags'
import styled from 'styled-components'
import { device } from '../../styles/responsive'

const FeedRightContainer = styled.div`
  flex: 0.4;
  height: 100%;
  position: fixed;
  right: 9%;
  top: 70px;
  width: 25%;

  @media ${device.laptop}{ 
    right: 4%;
    width: 30%;
  }

  @media ${device.tabletS}{ 
    display: none;
  }
`

const FeedRight = () => {
  return (
    <FeedRightContainer>
        <PopularHashtags />
        <OnLineFriends />
    </FeedRightContainer>
  )
}

export default FeedRight