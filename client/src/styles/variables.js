import styled, { css } from "styled-components";
import { device } from "./responsive";

//custom variable styles
export const style = {
    textSize: "14px",
    mobileText: "12px",
    mobileTextSmall: "10px",
    headingSize: "24px",
    subHeadingSize: "20px",
}

//utility styles

export const flexCenter = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const flexAround = css`
    display: flex;
    justify-content: space-around;
    align-items: center;
`

export const flexBetween = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const flexCol = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const profilePic = css`
    border-radius: 50%;
    height: 40px;
    width: 40px;
    cursor: pointer;
`

export const button = css`
    background-color: #A435F0;
    padding: 10px 16px;
    border-radius: 6px;
    color: #FFFFFF;
    outline: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: ${style.textSize};
    
    @media ${device.mobileL}{
        padding: 6px 10px;
        font-size: ${style.mobileText};
    }
    `

export const borderedButton = css`
    /* background-color: #fff; */
    background-color: ${({theme}) => theme.bgSoft};
    padding: 8px 12px;
    border: 1px solid #A435F0;
    border-radius: 6px;
    color: #A435F0;
    outline: none;
    font-weight: 600;
    cursor: pointer;
    font-size: ${style.textSize};
    
    @media ${device.mobileL}{
        padding: 6px 10px;
        font-size: ${style.mobileText};
    }
`

export const EmptyPlaceHolder = styled.h1`
    font-size: 2rem;
    /* color: lightgray; */
    color: ${({theme}) => theme.textSecondary};
    height: 80vh;
    margin: 0 auto;
    display: grid;
    place-items: center;
    cursor: default;
    
    @media ${device.tabletS}{
        font-size: 1.5rem;
    }

`