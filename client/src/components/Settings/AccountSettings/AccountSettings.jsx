import React, { useContext, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import styled from "styled-components";
import { button, style } from "../../../styles/variables";
import {GoUnverified, GoVerified} from 'react-icons/go'
import { axiosPrivate } from "../../../api/apiRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, logout, reset, sendVerificationEmail } from "../../../features/auth/authSlice";
import { ThemeContext } from "../../../context/themeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { device } from "../../../styles/responsive";
import { resetFriends } from "../../../features/friend/friendSlice";

const SettingsDiv = styled.div`
  margin: 2rem 0;
`;

const Desc = styled.p`
  font-size: 14px;

  @media ${device.mobileL}{ 
    font-size: ${style.mobileText};
  }
`;

const Hr = styled.hr`
  margin: 10px 0;
`;

// const ThemeInput = styled.input.attrs({ type: "checkbox" })`
//   width: 20px;
//   height: 20px;
// `;

const Toggle = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`;

const Slider = styled.span`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  background-color: #ae35f0;
  border-radius: 34px;
  transition: all 0.3s ease;

  &:before {
    position: absolute;
    content: "";
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props => props.darkMode ? "#111" : "yellow"};
    top: 2px;
    left: 2px;
    transition: all 0.3s ease;
  }
`;

const ThemeInput = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider} {
    background-color: #ae35f0;
  }

  &:checked + ${Slider}::before {
    transform: translateX(26px);
  }
`;

const Button = styled.button`
  ${button}
  margin-top: 10px;
`;

const AccountSettings = ({ currentUser }) => {
  document.title = 'MeetFrends - Settings'
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const {currentUser} = useSelector(state => state.auth)
  const {darkMode, setDarkMode} = useContext(ThemeContext)

  const verifyUserHandler = async () => {
    await dispatch(sendVerificationEmail())
  };

  const deleteUserHandler = async () => {
    if(currentUser?.username === 'test') {
      alert('You can\'t delete "test" account, as it\'s for public use. Please try this feature from own account.')
      return
    }
    confirmAlert({
      title: "Confirm to Delete",
      message: "Your friends will miss you😥",
      buttons: [
        {
          label: "Yes, delete it",
          onClick: async () => {
            await dispatch(deleteUser())
            !currentUser?._id && navigate('/', {replace: true})
          },
        },
        {
          label: "No, not now",
        },
      ],
    });
  };

  const deactivateHandler = async () => {
    if(currentUser?.username === 'test') {
      alert('You can\'t deactivate "test" account, as it\'s for public use. Please try this feature from own account.')
      return
    }
    confirmAlert({
      title: "Confirm to Deactivate",
      message: "You can think about to logout",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const {data} = await axiosPrivate.put(`/user/deactivate`)
            if(data?.status === 'Success'){
                dispatch(logout())
                dispatch(reset())
                dispatch(resetFriends())
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const themeHandler = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <>
      <h1>Account Settings</h1>

      <SettingsDiv>
        {!currentUser?.isVerified ? (
          <>
            <h4>Verify your email <GoUnverified style={{color: '#c10000'}} /></h4>
            <Hr />
            <Desc>
              Without email verification, you cannot perform any action except to view others posts. On clicking the button below, you will receive an email. Please check in the Junk folder, if you don't find it in your inbox
            </Desc>
            <Button onClick={verifyUserHandler}>Send Verification Link</Button>
          </>
        ) : (
            <>
                <h4>Verify your email <GoVerified style={{color: '#54ad54'}} /></h4>
                <Hr />
                <Button style={{background: 'grey', cursor: 'none'}}>Email Verified</Button>
            </>
        )}
      </SettingsDiv>

      <SettingsDiv>
        <h4>Theme Preference</h4>
        <Hr />
        <Desc>{darkMode ? 'Dark mode' : 'Light mode'}</Desc>
        <Toggle>
          <ThemeInput name="theme" onClick={themeHandler} checked={darkMode} darkMode={darkMode} />
          <Slider darkMode={darkMode} />
        </Toggle>
      </SettingsDiv>

      <SettingsDiv>
        <h4 style={{ color: "#ff1c1c" }}>Deactivate your account</h4>
        <Hr />
        <Desc>
          Others can't see your profile and can't even send you messages. You can activate your account by simply logging in again
        </Desc>
        <Button onClick={() => deactivateHandler()} style={{ background: "#ff1c1c" }}>
          Deactivate
        </Button>
      </SettingsDiv>

      <SettingsDiv>
        <h4 style={{ color: "#ff1c1c" }}>Delete your account permanently</h4>
        <Hr />
        <Desc>
          Once you delete, your all posts will be removed and the account cannot be restored. But you can still create a new account with the same email
        </Desc>
        <Button onClick={() => deleteUserHandler()} style={{ background: "#ff1c1c" }}>
          Delete
        </Button>
      </SettingsDiv>
    </>
  );
};

export default AccountSettings;
