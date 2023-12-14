import React from 'react'
import { EmptyPlaceHolder, flexCol } from '../../styles/variables'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const NotFundWrapper = styled.section`
    height: calc(100vh - 60px);
    margin: 0 auto;
    ${flexCol}
    gap: 12px;

    p{
        color: ${({theme}) => theme.text};
        cursor: pointer;
        text-align: center;
        text-decoration: underline;
    }
`

const NotFound = () => {
    document.title = 'MeetFrends - Page Not Found'
    const navigate = useNavigate()

  return (
    <NotFundWrapper>
        <EmptyPlaceHolder style={{height: 'fit-content'}}>404, Page Not Found!!!</EmptyPlaceHolder>
        <p onClick={() => navigate('/feed')}>Go To Home Page</p>
    </NotFundWrapper>
  )
}

export default NotFound