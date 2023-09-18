import { Link } from "react-router-dom"
import styled from "styled-components"
import { flexAround, flexBetween, flexCenter, flexCol, style } from "../../styles/variables"
import { device } from "../../styles/responsive"

export const Wrapper = styled.div`
  position: relative;
  text-align: center;
  width: 100%;
  padding: 2rem;
  background-color: ${({theme}) => theme.bgForm};

  @media ${device.tabletS}{
    padding: 1rem;
  }
`

export const SignupWrapper = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  background-color: ${({theme}) => theme.bgForm};

  @media ${device.tabletS}{
    padding: 1rem;
  }
`

export const Header = styled.header`
  font-size: ${style.headingSize};
  font-weight: 600;
  margin: 1rem 0;
  color: #fff;
`

export const Form = styled.form`
  ${flexCol}
  width: 100%;
  gap: 1rem;
`

export const InputField = styled.div`
  width: 100%;
`

export const Error = styled.span`
  color: #ffa2a2;
  font-size: 14px;
`

export const InputText = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  outline: none;
  border: none;
  font-size: ${style.textSize};
  padding: 8px 1rem 8px 8px;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.text};

  ::placeholder{
    color: ${({theme}) => theme.textSecondary};
  }
`

export const ShowPwd = styled.div`
  position: absolute;
  top: 25%;
  left: 90%;
  cursor: pointer;
` 

export const Label = styled.label`
  font-size: 14px;
  color: ${({theme}) => theme.white};
`

export const InputButton = styled.input.attrs({type: `submit`})`
  width: 33%;
  background-color: #f7f7f7;
  color: #a435f0;
  color: ${({theme}) => theme.bg};
  height: 40px;
  border-radius: 5px;
  outline: none;
  border: none;
  font-size: ${style.textSize};
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1rem;
`

export const P = styled.p`
  color: #fff;
`

export const LoginLink = styled.span`
  width: 100%;
  color: ${({theme}) => theme.highlight};
  cursor: pointer;
  text-decoration: underline;
`

export const Gender = styled.div`
  ${flexCenter}
  gap: 10px;
`

export const Option = styled.label`
  /* ${flexCenter} */
  color: ${({theme}) => theme.white};
`

export const LinkWrapper = styled.div`
  ${flexBetween};
  color: #fff;
  flex-direction: column;
  font-size: 13px;
`

export const SignupLink = styled(LoginLink)`
  text-decoration: underline;
  color: ${({theme}) => theme.highlight};
`

export const ForgetPassword = styled(Link)`
  color: #fff;
  margin-bottom: 8px;
  text-decoration: underline;
`

export const AuthLinkWrapper = styled.p`
  width: 100%;
  min-height: 40px;
  max-height: fit-content;
  border-radius: 5px;
  outline: none;
  border: none;
  font-size: ${style.textSize};
  padding: 8px 1rem 8px 8px;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.text};
`