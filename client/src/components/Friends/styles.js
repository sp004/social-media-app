import styled from "styled-components";
import { borderedButton, flexBetween, flexCenter, flexCol, style } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const FriendsDiv = styled.div`
    ${flexCol}
    /* margin-top: 10px; */
    padding: 0 1rem;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};
`

export const Friend = styled.div`
  width: 100%;
  ${flexBetween}
  padding: 1rem 0;

  :not(:last-child){
    border-bottom: 1px solid lightgrey;
  }
`

export const FriendInfo = styled.div`
  ${flexCenter}
  gap: 6px;
  cursor: pointer;
`

export const FriendAvatar = styled.img`
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;

  @media ${device.mobileL}{ 
    min-width: 30px;
    height: 30px;
  }
`

export const FriendDetails = styled.div`
    h5{
      text-transform: capitalize;

      @media ${device.mobileM}{ 
        font-size: ${style.mobileText};
      }
    }
    
    p{
      font-size: ${style.mobileText};

      @media ${device.mobileM}{ 
        font-size: ${style.mobileTextSmall};
      }

    }
`

export const ButtonDiv = styled.div`
    display: flex;
    gap: 0.5rem;
`

export const FriendStatusButton = styled.button`
  ${borderedButton};
  font-size: 12px;
`