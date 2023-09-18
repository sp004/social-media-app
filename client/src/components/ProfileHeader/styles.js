import styled, { css } from "styled-components";
import { button, flexAround, flexBetween, flexCenter, flexCol, style } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const ProfileHeaderWrapper = styled.div`
    width: 100%;
    /* height: fit-content; */
    height: 600px;
    display: flex;
    flex-direction: column;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};

    @media ${device.tabletS}{ 
        height: 500px;
    }
`

export const Images = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
`

export const CoverImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 280px;
    background-color: lightgrey;
    overflow: hidden;
    ${flexCol};

    @media ${device.tabletS}{ 
        height: 200px;
    }
`

export const CoverImage= styled.img`
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
`

export const CoverImageEdit = styled.label`
    position: absolute;
    top: 0;
    left: 85%;
    height: fit-content;
    width: fit-content;
    padding: 4px;
    background-color: rgba(255, 255, 255, 0.7);
    color: #a435f0;
    ${flexCenter}
    gap: 4px;
    cursor: pointer;
    font-size: 14px;
`

export const UserInfo = styled.div`
    transform: translate(0%, -40%);
`

export const UserInfoHeader = styled.div`
    text-align: center;

    h2{
        text-transform: capitalize;
    }

    sub{
        font-size: 14px;

        @media ${device.mobileL}{ 
            font-size: ${style.mobileText};
        }
    }

    p{
        font-size: 16px;
        margin-top: 6px;

        @media ${device.mobileL}{ 
            font-size: ${style.mobileText};
        }
    }
`

export const ViewAvatar = styled.img`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    height: 50%;
    border: 3px solid #a435f0;
    object-fit: contain;
    
    /* img{
        width: 100%;
        height: 99%;
    } */
`

export const AvatarPreviewWrapper = styled.div`
    ${flexCol}
    gap: 10px;

    @media ${device.tabletS}{
        width: 100%;
        height: 80%;
    }
`

export const UploadButton = styled.button`
    ${button}
`

export const ProfilePicContainer = styled.div`
    width: 200px;
    height: 200px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;

    &::before{
        content: '';
        position: absolute;
        top: 79%;
        left: 79%;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background-color: ${({theme}) => theme.soft};
        border: 1px solid #a435f0;
        display: ${props => props.isMyProfile ? 'block' : 'none'};
    }

    @media ${device.tabletS}{ 
        width: 150px;
        height: 150px;
    }
`

export const EditIcon = styled.svg`
    position: absolute;
    top: 80%;
    left: 80%;
    cursor: pointer;
    color: #a435f0;
`

export const ToolBox = styled.div`
    position: absolute;
    top: 55%;
    left: 10%;
    width: 120px;
    height: fit-content;
    border-radius: 5px;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
    border: 1px solid grey;
`

export const ToolBoxItem = styled.div`
    padding: 6px 8px;
    font-size: small;
    cursor: pointer;

    &:hover{
        background-color: #a435f0;
        color: #fff;
    }
`

export const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
    border: 4px solid #a435f0;
`

export const FriendActions = styled.div`
    ${flexCenter}
    gap: 2rem;
    transform: translate(0,-250%);
    margin-top: 12px;

    /* @media ${device.tabletS}{ 
        margin-top: 1rem;
    } */
`

export const FriendActionButton = styled.button`
    ${button}
`

export const ProfileInfo = styled.div`
    ${flexAround}
    margin: 2rem 0 1rem;
    transform: translate(0, -235%);
`

export const ProfileInfoDiv = styled.div`
    ${flexCol};
    flex: 1;

    :last-child{
        cursor: pointer;
    }

    @media ${device.mobileL}{ 
        font-size: ${style.mobileText};
    }
`