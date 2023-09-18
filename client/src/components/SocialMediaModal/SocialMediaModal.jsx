import React, { useState } from 'react'
import { CloseIcon, Modal, ModalContent, ModalOverlay } from '../CreatePostModal/styles'
import { FacebookIcon, FacebookShareButton, FacebookShareCount, LinkedinIcon, LinkedinShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share'
import ShareButton from 'react-share/lib/ShareButton'
import styled, { css } from 'styled-components'
import { useLocation } from 'react-router-dom'
import { borderedButton } from '../../styles/variables'

const ShareContainer = styled.div`
    /* transform: translateY(-100vh); */
    opacity: 0.5;
    transition: all 3s ease-in-out;
    ${(props) => props.openModal && 
        css`
            /* transform: translateY(0); */
            opacity: 1;
        `
    };
`

const SocialMediaIcons = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 1rem;
`

const PostLink = styled.div`
    width: 100%;

    input{
        padding: 8px 1rem;
        border-radius: 25px;
        background-color: #eee;
        border: none;
        outline: none;
        width: 100%;
    }
`

const Button = styled.button`
    ${borderedButton}
    margin-top: 10px;
`

const SocialMediaModal = ({openModal, setOpenModal, post}) => {
    const postUrl = `${import.meta.env.VITE_APP_FRONTEND_URL}/shared-post/${post._id}`
    const [copied, setCopied] = useState(false);

  return (
    <ShareContainer openModal={openModal}>
        <Modal>
            <ModalContent>
                <CloseIcon onClick={() => setOpenModal(false)} />
                <h4 style={{marginTop: '2rem'}}>Share</h4>
                <SocialMediaIcons>
                    <FacebookShareButton url={postUrl} quote={'Post from MeetFrends'} hashtag='#meetfrends'>
                        <FacebookIcon size={48} round={true}/>
                    </FacebookShareButton>

                    <WhatsappShareButton url={postUrl}>
                        <WhatsappIcon size={48} round={true} />
                    </WhatsappShareButton>

                    <LinkedinShareButton url={postUrl}>
                        <LinkedinIcon size={48} round={true} />
                    </LinkedinShareButton>
                </SocialMediaIcons>

                <PostLink>
                    <input type="text" value={postUrl} readOnly />
                    <Button onClick={() => {
                        navigator.clipboard.writeText(postUrl)
                        setCopied(true)
                    }}>
                        {copied ? 'Copied to clipboard' : 'Copy'}
                    </Button>
                </PostLink>
            </ModalContent>
        </Modal>

        {/* Background overlay */}
        <ModalOverlay onClick={() => setOpenModal(false)}></ModalOverlay>
    </ShareContainer>
  )
}

export default SocialMediaModal