import styled from "styled-components";
import { flexBetween, flexCenter, style } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const SuggestedFriendsContainer = styled.div`
    width: 100%;
    height: 35%;
    box-shadow: 0px 0px 5px 1px #d8d8d8;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};
    padding: 1rem;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }

    
  @media ${device.tablet}{ 
    height: 38%;
  }
`

export const SuggestedFriendsList = styled.div`
    ${flexCenter};
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
`

export const Tag = styled.div`
    width: 100%;
    ${flexBetween};
    
    p{
        font-size: 13px;
        
        &:nth-child(1):hover{
            cursor: pointer;
            text-decoration: underline;
            color: #ae35f0;
        }

        @media ${device.tablet}{
            font-size: ${style.mobileTextSmall};
        }
    }
`