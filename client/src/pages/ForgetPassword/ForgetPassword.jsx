import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosPublic } from "../../api/apiRequest";
import { Button, Input, Form, FormContainer } from "./styles";
import { Link, NavLink } from "react-router-dom";

const ForgetPassword = () => {
  document.title = 'MeetChat - Forget Password'
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const forgetPwdHandler = async ({email}) => {
    if(email === 'test@gmail.com') {
      setError("You can't change password of 'test' account. Please try this feature from own account.")
      return
    }
    try {
      const {data} = await axiosPublic.post(`/user/forget-password`, {email})
      data?.status === 'Success' && setMessage(data?.message)
    } catch (error) {
      setError(error?.response?.data?.message)
      setTimeout(() => {
        setError("")
      }, 3000);
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(forgetPwdHandler)}>
        <h3>Enter Registered Email</h3>
        <sub>You will receive reset password link to this email</sub>
        <Input
          type="text"
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
          })}
          onChange={() => setError("")}
        />
        {message && <sub style={{color: "#00ff00", fontWeight: 600}}>{message}</sub>}
        {error && <sub style={{color: "#FFC0CB", fontWeight: 600}}>{error}</sub>}
        <Button>Submit</Button>
        <Link to='/' style={{color: "#fff"}}>Go to Login →</Link>
      </Form>
    </FormContainer>
  );
};

export default ForgetPassword;
