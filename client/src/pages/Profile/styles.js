import styled from "styled-components";
import { device } from "../../styles/responsive";

export const ProfileContainer = styled.section`
    width: 50%;
    margin: 4rem auto 3rem auto;
    /* background-color: ${({theme}) => theme.bgTertiary}; */

    @media ${device.tablet}{ 
        width: 90%;
    }
`

export const Error = styled.div`
    height: calc(100vh - 60px);
    margin: 0 auto;
    display: grid;
    place-items: center;

    h1{
        color: grey;
    }
`