import { BsThreeDots } from "react-icons/bs";
import styled from "styled-components";
import { flexAround, flexBetween, flexCenter, profilePic, style } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const PostContainer = styled.div`
    width: 100%;
    padding: 2rem 2rem 1rem 2rem;
    border-radius: 5px;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
    margin: 1rem auto;
    position: relative;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

    @media ${device.mobileL}{ 
    padding: 1rem;
  }
`

export const PostTopRow = styled.div`
    ${flexBetween};
    margin-bottom: 1rem;
`

export const PostAuthorInfo = styled.div`
    ${flexCenter};
    gap: 8px;
`

export const Avatar = styled.img`
    ${profilePic};
    cursor: pointer;
    object-fit: cover;
`

export const PostInfo = styled.div`
    flex-direction: column;
    
`

export const PostAuthor = styled.h5`
    cursor: pointer;
`

export const PostTimeago = styled.span`
    color: ${({theme}) => theme.text};
    font-size: 12px;

    @media ${device.mobileL}{ 
        font-size: ${style.mobileTextSmall};
    }
`

export const ThreeDots = styled(BsThreeDots)`
    cursor: pointer;
`

export const PostActionButton = styled.div`
    ${flexCenter}
    gap: 6px;
`

export const IconHolder = styled.span`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-color: ${({theme}) => theme.soft};
    cursor: pointer;
    color: #ae35f0;
    ${flexCenter}

    @media ${device.mobileL}{
        height: 20px;
        width: 20px;
    }

    svg{
        @media ${device.mobileL}{
            font-size: 14px;
        }
    }
`

export const PostText = styled.p`
    font-size: 14px;
    margin: 1.5rem 0;

    @media ${device.mobileL}{ 
        font-size: ${style.mobileText};
    }
`

export const TaggedUser = styled.span`
    cursor: pointer;
    width: fit-content;
    background-color: #e4bbff;
    color: #111;
    font-size: 13px;
    margin: 6px 6px 6px 0;
    padding: 2px;
    /* border-radius: 25px; */
    text-transform: capitalize;
    font-weight: 500;

    @media ${device.mobileL}{ 
        font-size: ${style.mobileTextSmall};
    }
`

export const PostImage = styled.img`
    width: 100%;
    /* min-height: 400px; */
    height: fit-content;
    object-fit: contain;
    margin-top: 8px;

    @media ${device.tablet}{
        min-height: 200px;
    }
`

export const PostBottomRow = styled.div`
    ${flexBetween};
    margin: 1.4rem 0;
    border-top: 1px solid lightgray;
`

export const PostBottomAction = styled.div`
    ${flexCenter};
    gap: 6px;
    flex: 1;
    margin-top: 6px;
    padding: 4px 0;

    @media ${device.tabletS}{ 
        :last-child{
            justify-content: flex-end;
        }
    
        :nth-child(1){
            justify-content: flex-start;
        }
    
        :nth-child(2){
            flex: 1.7;
        }
    }

    span{
        font-size: 13px;

        @media ${device.mobileL}{ 
            font-size: ${style.mobileTextSmall};
        }
    }

    svg{
        font-size: 20px;
        cursor: pointer;

        @media ${device.mobileL}{
            font-size: ${style.mobileText};
        }
    }
`
