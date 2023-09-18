import styled from "styled-components"
import { button, flexCol } from "../../styles/variables"
import { device } from "../../styles/responsive"

export const FormContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  margin: 0 auto;
`

export const Form = styled.form`
  ${flexCol}
  height: fit-content;
  gap: 1rem;
  box-shadow: 0px 0px 2px 1px #e9e9e9;
  border-radius: 5px;
  width: 400px;
  padding: 1.5rem 1rem;
  background-color: ${({theme}) => theme.bgForm};
  color: #fff;

  @media ${device.mobileL}{
    width: 90%;
    /* margin: 1rem; */
  }
`

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 4px 4px 4px 8px;
  outline: none;
  border: none;
  border-radius: 5px;
  background-color: ${({theme}) => theme.bgTertiary};
  color: ${({theme}) => theme.text};

  ::placeholder{
    color: ${({theme}) => theme.textSecondary};
  }
`

export const Button = styled.button`
  ${button};
  background-color: #fff;
  color: #A435F0;
`