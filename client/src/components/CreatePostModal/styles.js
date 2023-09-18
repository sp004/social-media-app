import styled from "styled-components";
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { button, flexBetween, flexCenter } from "../../styles/variables";
import { device } from "../../styles/responsive";

export const Modal = styled.section`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    width: 50%;
    height: 450px;
    background-color: #fff;
    padding: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }

    @media ${device.tabletS}{
        width: 90%;
    }

    ${props => props.profilPic && css`
        @media ${device.tabletS}{
            height: 65%;
        }
    `}

`

export const ModalContent = styled.div`
    max-width: 800px;
    margin: 0 auto;
`

export const CloseIcon = styled(AiOutlineCloseCircle)`
    float: right;
    font-size: 1.5rem;
    cursor: pointer;
    margin-bottom: 10px;
    background: #ae35f0;
    border-radius: 50%;
    color: white;
`

export const MentionedUser = styled.p`
    ${flexCenter}
    justify-content: flex-start;
    gap: 6px;
    margin: 1rem 0;
    
    p{
        font-size: 12px;
        background-color: ${({theme}) => theme.highlight};
        padding: 2px;
    }
`

export const WritePost = styled.textarea`
    width: 100%;
    resize: none;
    outline: none;
    border: 1px solid ${({theme}) => theme.text};
    padding: 0.5rem;
    margin-bottom: 8px;
    border-radius: 5px;
    background-color: ${({theme}) => theme.bgSecondary};
    color: ${({theme}) => theme.text};
    
    ::placeholder{
        color: ${({theme}) => theme.text};
    }
`

export const PreviewImage = styled.img`
    width: 300px;
    height: 300px;
    object-fit: cover;
`

export const ImageUpload = styled.div`
    /* width: fit-content;
    overflow: hidden; */
    ${flexBetween}
`

export const UploadLable = styled.label`
    cursor: pointer;
    color: #ae35f0;
    font-size: 1.5rem;
`

export const Filename = styled.span`
    font-size: 13px;
    margin-left: 6px;
    font-weight: 600;
`

export const Upload = styled.input`
    display: none;
`

export const SubmitPost = styled.button`
    ${button}
    float: right;
    transform: filter 300ms;

    &:hover{
        filter: brightness(1.06)
    }
`

export const Message = styled.p`
    font-size: 12px;
    color: red;
    font-weight: 500;
`

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9;
`