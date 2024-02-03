import React, { useContext } from 'react'
import styled from 'styled-components'
import { SocketContext } from '../../context/socketContext'
import { EmptyPlaceHolder, flexBetween, flexCenter, flexCol, style } from '../../styles/variables'
import moment from 'moment'
import { device } from '../../styles/responsive'

const NotificationContainer = styled.section`
  width: 60%;
  background-color: ${({theme}) => theme.bgSecondary};
  color: ${({theme}) => theme.text};
  margin: 6rem auto 2rem auto;
  /* box-shadow: 0px 0px 8px 1px #e9e9e9; */

  @media ${device.tablet}{ 
    width: 90%;
  }
`

const NotificationHeader = styled.div`
  ${flexBetween}
  padding: 1rem;
`

const NotificationWrapper = styled.div`
  ${flexCol}
  gap: 10px;
  padding: 1rem;

  @media ${device.mobileM}{ 
    padding: 8px;
  }
`

const NotificationCard = styled.div`
  padding: 1rem;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.text};
  width: 100%;
  /* box-shadow: 0px 0px 8px 1px #d9d9d9; */
  ${flexBetween}

  @media ${device.mobileM}{ 
    padding: 10px;
  }

  p{
    @media ${device.mobileM}{ 
      font-size: ${style.mobileText} !important;
    }
  }

  sub{
    @media ${device.mobileM}{ 
      font-size: ${style.mobileTextSmall} !important;
      text-align: right;
    }
  }
`

const Notification = () => {
  document.title = 'MeetFrends - Notification'
  const {notifications} = useContext(SocketContext)
  let content = ''
  console.log(notifications)

  const displayNotification = (n)  => {
    if(n?.type === 'like'){
      content = <span><b>{n.sender}</b> liked your post</span>
    }else if(n?.type === 'comment'){
      content = <span><b>{n.sender}</b> commented your post</span>
    }else if(n?.type === 'share'){
      content = <span><b>{n.sender}</b> shared your post</span>
    }else if(n?.type === 'request'){
      content = <span><b>{n.sender}</b> sent you a friend request </span>
    }else if(n?.type === 'accept'){
      content = <span><b>{n.sender}</b> accepted your friend request</span>
    }else{
      return
    }

    return content
  }

  return (
    <NotificationContainer>
      <NotificationHeader>
        <h3>Notifications ({[...new Set(notifications)]?.length})</h3>
      </NotificationHeader>
      <NotificationWrapper>
        {notifications?.length > 0 
        ? 
          <>
            {[...new Set(notifications)]?.map((notification, i) => (
              <NotificationCard key={i}>
                <p style={{fontSize: '14px'}}>{displayNotification(notification)}</p>
                <sub style={{fontSize: '11px'}}>{moment(notification?.createdAt).fromNow()}</sub>
              </NotificationCard>
            ))}
          </>
        :
          <EmptyPlaceHolder style={{height: '70vh'}}>There is no notification</EmptyPlaceHolder>
        }
      </NotificationWrapper>
    </NotificationContainer>
  )
}

export default Notification