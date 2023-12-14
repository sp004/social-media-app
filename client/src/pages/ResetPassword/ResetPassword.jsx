import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, FormContainer, Input } from "../ForgetPassword/styles";
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import { useNavigate, useParams } from "react-router-dom";
import { axiosPublic } from "../../api/apiRequest";
import styled from "styled-components";

const InputDiv = styled.div`
  position: relative;
  width: 100%;
`

const Icon = styled.svg`
  position: absolute;
  top: 0;
  left: 90%;
  transform: translateY(70%);
  cursor: pointer;
  color: #000;
`

const ResetPassword = () => {
  document.title = 'MeetFrends - Reset Password';
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showCPwd, setShowCPwd] = useState(false)
  const {resetToken} = useParams()
  const navigate = useNavigate()

  const resetPwdHandler = async ({password, confirmPassword}) => {
    try {
      const {data} = await axiosPublic.post(`/user/reset-password/${resetToken}`, {password, cPassword: confirmPassword})
      // console.log(data)
      setMessage(data.message)
      setTimeout(() => {
        navigate('/', {replace:true})
      }, 1500);
    } catch (error) {
      setError(error?.response?.data?.message)
      setTimeout(() => {
        setError('')  
      }, 3000);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(resetPwdHandler)}>
        <h3>Password Reset</h3>
        <InputDiv>
          <Input
            type={!showPwd ? "password" : "text"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {showPwd ? 
            <Icon onClick={() => setShowPwd(prev => !prev)} as={AiOutlineEyeInvisible} /> : 
            <Icon onClick={() => setShowPwd(prev => !prev)} as={AiOutlineEye} />
          }
        </InputDiv>

        <InputDiv>
          <Input
            type={!showCPwd ? "password" : "text"}
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
            })}
          />
          {showCPwd ? 
            <Icon onClick={() => setShowCPwd(prev => !prev)} as={AiOutlineEyeInvisible} /> : 
            <Icon onClick={() => setShowCPwd(prev => !prev)} as={AiOutlineEye} />
          }
        </InputDiv>
        {message && <sub style={{color: "#00ff00", fontWeight: 500, textAlign: 'center'}}>{message}</sub>}
        {error && <sub style={{color: "#ffc0cb", fontWeight: 500, textAlign: 'center'}}>{error}</sub>}
        <Button>Reset</Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPassword;
