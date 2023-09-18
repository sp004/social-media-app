import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/apiRequest";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import { button, flexCol } from "../../styles/variables";
import { userVerification } from "../../features/auth/authSlice";

const Verify = styled.div`
    width: 100vw;
    height: calc(100vh - 60px);
    margin: 0 auto;
    ${flexCol};
    gap: 1rem;
`

const VerifyButton = styled.button`
    ${button}
`

const VerifyUser = () => {
  document.title = 'MeetChat - Verify User'
  const [status, setStatus] = useState(false)
  const [error, setError] = useState('')

  const { verificationToken } = useParams();
  const {message, isSuccess} = useSelector(state => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const verifyUserHandler = async () => {
    await dispatch(userVerification(verificationToken))
    // try {
    //   const res = await axiosPrivate.patch(`/auth/verify/${verificationToken}`);
    //   console.log(res.data);
    //   setStatus(true)
    //   setTimeout(() => {
    //     navigate('/feed', {replace: true})
    //   }, 3000);
    // } catch (error) {
    //   setError(error?.response?.data?.message)
    // }
  };

  useEffect(() => {
    if (isSuccess && message === 'Your account has been verified.') {
      navigate("/feed", { replace: true });
    }
  }, [message]);

  return (
    <Verify>
      <VerifyButton onClick={verifyUserHandler}>{status ? "Email Verified" : "Verify Email"}</VerifyButton>
      {!isSuccess && <p style={{color: 'red'}}>{message}</p>}
      {status && <ClipLoader color="#000" />}
      {status && <p>You will be redirecting to Home page</p>}
    </Verify>
  );
};

export default VerifyUser;
