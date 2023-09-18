import styled from "styled-components";
import { flexBetween, flexCenter } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const OnlineFriendsContainer = styled.div`
    width: 100%;
    height: calc(60vh - 60px);
    margin-top: 2rem;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 1rem;
    ::-webkit-scrollbar {
    display: none;
}
`

export const OnlineFriendsList = styled.div`
    ${flexCenter};
    flex-direction: column;
    padding: 1rem 0;
`

export const UserCard = styled.div`
    background-color: ${({theme}) => theme.bgSecondary};
    width: 100%;
    padding: 8px 12px;
    margin: 4px 0;
    border-bottom: 1px solid #e0e0e0;
    ${flexBetween}

    
  @media ${device.tablet}{ 
    padding: 6px 0;
  }
`

export const UserProfileInfo = styled.div`
    ${flexCenter}
    gap: 6px;
    cursor: pointer;
`

export const OnlineDot = styled.div`
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #00ff00;
`