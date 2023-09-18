import React, { useContext } from 'react'
import { flexCol, style } from '../../styles/variables'
import styled from 'styled-components'
import moment from 'moment/moment'
import { useSelector } from 'react-redux'
import { ChatContext } from '../../context/ChatContext'
import { device } from '../../styles/responsive'

const MessageWrapper = styled.div`
    margin: 12px 0;
    height: fit-content;

    @media ${device.tabletS}{
        margin: 6px 0;
    }
`

const MessageCard = styled.div`
    margin-left: ${props => !props.received ? 'auto' : 0};
    width: fit-content;
    ${flexCol};
    align-items: ${props => !props.received ? 'flex-end' : 'flex-start'};
`

const Text = styled.p`
    padding: 8px 1.5rem;
    border-radius: 50px;
    background-color: ${props => props.received ? '#ae35f0' :' #dfdfdf'};
    color: ${props => props.received ? '#fff' :' #000'};
    font-size: 15px;
    /* overflow-wrap: break-word; */
    overflow: hidden;
    display: flex;
    align-items: center;

    @media ${device.tabletS}{
        padding: 5px 1rem;
        font-size: ${style.mobileText}
    }
`

const MessageTime = styled.sub`
    color: gray;
    width: 100%;
    font-size: 12px;
    padding: 0 6px;
    overflow: hidden;
    text-align: ${props => props.received ? 'left' : 'right'};

    @media ${device.tabletS}{
        margin-top: 4px;
        padding: 0;
        font-size: ${style.mobileTextSmall}
    }
`

const Message = ({data}) => {
    const {conversation} = useContext(ChatContext)
    const {currentUser} = useSelector(state => state.auth)

    // let isReceived = data?.sender ? data?.sender !== currentUser._id : data?.received
    let isReceived = data?.sender !== currentUser._id

  return (
    <MessageWrapper>
        <MessageCard received={isReceived}>
            <Text received={isReceived}>{data?.message}</Text>
            <MessageTime received={isReceived}>{moment(data?.createdAt).format('DD/MM/YYYY hh:mm:ss A')}</MessageTime>
        </MessageCard>
    </MessageWrapper>
  )
}

export default Message