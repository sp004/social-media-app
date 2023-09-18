import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { flexAround, flexBetween, flexCenter, style } from "../../styles/variables";
import { device } from "../../styles/responsive";
import { RxHamburgerMenu } from "react-icons/rx";

export const NavContainer = styled.nav`
    height: 60px;
    padding: 6px 0;
    background-color: ${({theme}) => theme.navbar};
    z-index: 99999;
    position: fixed;
    top: 0;
    width: 100%;
    margin-bottom: 1rem;
`

export const NavWrapper = styled.div`
    ${flexBetween};
    gap: 1rem;
    height: 100%;
    width: 100%;
    padding: 0 3rem;

    @media ${device.tablet}{
        justify-content: space-around;
        padding: 0 10px;
    }
`

export const Logo = styled(Link)`
    cursor: pointer;
    height: 100%;
    overflow-y: hidden;
`

export const LogoImg = styled.img`
    width: 50px;
    height: 100%;
    object-fit: cover;
`

export const Menus = styled.div`
    ${flexCenter};
    gap: 10px;

    @media ${device.tablet}{
        gap: 4px;
    }

    @media ${device.tabletS}{
        position: fixed;
        bottom: 0;
        background-color: ${({theme}) => theme.navbar};
        ${flexBetween}
        gap: 10px;
        width: 100vw;
        padding: 6px 12px;
        border-top: 2px solid #fff;
        z-index: 9999;
    }
`

export const Menu = styled(NavLink)`
    position: relative;
    color: #deaeff;
    display: flex;
    font-size: ${style.headingSize};
    outline: none;
    width: 40px;
    padding: 6px;

    &.active {
        /* border-bottom: 4px solid #fff;
        padding-bottom: 2px; */
        svg{
            color: #fff;
        }
    }
`

export const Counter = styled.span`
    position: absolute;
    width: 15px;
    height: 15px;
    left: 18px;
    top: 1px;
    background-color: red;
    border-radius: 50%;
    color: #fff;
    padding: 5px;
    overflow: hidden;
    ${flexCenter}
    font-size: 12px;
`

export const HamburgerMenu = styled(RxHamburgerMenu)`
  display: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;

  @media ${device.tabletS}{
    display: block;
  }
`