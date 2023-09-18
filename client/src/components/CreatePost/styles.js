import styled from "styled-components";
import { flexCenter, profilePic, style } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const CreatePostWrapper = styled.div`
    width: 100%;
    margin-bottom: 1rem;
    /* background-color: greenyellow; */
`

export const OnlineUsersTablet = styled.div`
    width: 100vw;
    padding: 1rem;
    display: none;
    overflow-x: scroll;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};

    @media ${device.tabletS}{
        display: block;
    }
`

export const OnlineUserHeading = styled.h4`
    margin-bottom: 1rem;    
`

export const OnlineUsersWrapper = styled.div`
    ${flexCenter}
    justify-content: flex-start;
    gap: 12px;
    width: fit-content;
`

export const OnlineUserAvatar = styled.img`
    height: 60px;
    min-width: 60px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;

    ::after{
        position: absolute;
        content: '';
        top: 5%;
        left: 50%;
        transform: translate(-50%, 0);
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background-color: lightgreen;
        z-index: 999;
    }

    @media ${device.mobileL}{ 
        height: 40px;
        min-width: 40px;
    }
`

export const OnlineUserName = styled.p`
    font-size: ${style.mobileText};
    
    text-align: center;
    
    @media ${device.mobileL}{ 
        font-size: ${style.mobileTextSmall};
    }
`

export const InputRow = styled.div`
    ${flexCenter}
    gap: 1rem;
    margin: 2rem;

    @media ${device.mobileL}{ 
        margin: 2rem 4px 2px 4px;
    }
`

export const Avatar = styled.img`
    ${profilePic};
`

export const InputText = styled.input.attrs({
    type: 'submit',
    value: 'Create your post'
})`
    outline: none;
    box-shadow: inset 0px 0px 4px 1px #d4d4d4;       
    border: none;
    flex: 1;
    height: 40px;
    padding: 5px 16px;
    border-radius: 25px;
    cursor: pointer;
    background-color: ${({theme}) => theme.bgTertiary};
    color: ${({theme}) => theme.text};
`