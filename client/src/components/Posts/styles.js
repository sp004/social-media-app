import styled from "styled-components";
import { device } from "../../styles/responsive";

export const FeedLeft = styled.section`
    width: 70%;
    height: 100%;
    
  @media ${device.tabletS}{ 
    margin: 0 auto;
    width: 100%;
  }
    
  @media ${device.mobileL}{ 
    margin: 0 auto;
    width: 100%;
  }
`

export const PostSection = styled.div`
    width: 80%;
    margin: 1rem auto;

    @media ${device.mobileL}{ 
        width: 90%;
    }

    @media ${device.tablet}{ 
        margin-bottom: 3rem;
    }
`