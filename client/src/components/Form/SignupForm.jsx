import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  reset,
  sendVerificationEmail,
  userRegister,
} from "../../features/auth/authSlice";
import {
  Form,
  Header,
  InputText,
  InputButton,
  LoginLink,
  SignupWrapper,
  InputField,
  Error,
  ShowPwd,
  AuthLinkWrapper,
} from "./styles";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";

const myCustomStyle = {
  background: '#333',
  color: '#fff',
  borderRadius: '8px',
  padding: '12px',
  fontSize: '16px',
  overflow: 'hidden',
};

const SignupForm = ({ setVisibility }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      cPassword: "",
    },
    mode: "onTouched",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, isLoading, currentUser, message } = useSelector(state => state.auth);

  const signupHandler = async (data) => {
    await dispatch(userRegister(data));
    await dispatch(reset())
  };

  useEffect(() => {
    if (message === "Successfully registered") {
      navigate("/feed");
    }
  }, [message, navigate]);

  useEffect(() => {
    if(!isSuccess && message){
      toast.error(message, {
        duration: 2000,
        style: myCustomStyle
      })
    }
  }, [isSuccess, message])
  

  return (
    <SignupWrapper>
      <Header>Signup</Header>
      <Form onSubmit={handleSubmit(signupHandler)}>
        <InputField>
          <InputText
            type="text"
            placeholder="Username"
            aria-label="Username"
            {...register("username", {
              required: "Username is required",
            })}
          />
          <Error>{errors.username?.message}</Error>
        </InputField>

        <InputField>
          <InputText
            type="text"
            placeholder="Full Name"
            aria-label="Full Name"
            {...register("fullname", {
              required: "Full Name is required",
            })}
          />
          <Error>{errors.fullname?.message}</Error>
        </InputField>

        <InputField>
          <InputText
            type="text"
            placeholder="Email Address"
            aria-label="Email Address"
            {...register("email", {
              required: "Email is required",
            })}
          />
          <Error>{errors.email?.message}</Error>
        </InputField>

        <InputField>
          <div style={{position: 'relative'}}>
            <InputText
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              aria-label="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <ShowPwd>
              {!showPassword 
                ?  <AiFillEye onClick={() => setShowPassword(prev => !prev)} /> 
                : <AiFillEyeInvisible onClick={() => setShowPassword(prev => !prev)} />}
            </ShowPwd>
          </div>

          <Error>{errors.password?.message}</Error>
        </InputField>

        <InputField>
          <div style={{position: 'relative'}}>
            <InputText
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              {...register("cPassword", {
                required: true,
                validate: (val) => {
                  if (watch("password") !== val) {
                    return "Confirm Password must be same as password";
                  }
                },
              })}
            />
            <ShowPwd>
              {!showConfirmPassword 
                ? <AiFillEye onClick={() => setShowConfirmPassword(prev => !prev)} /> 
                : <AiFillEyeInvisible onClick={() => setShowConfirmPassword(prev => !prev)} />}
            </ShowPwd>
          </div>

          <Error>{errors.cPassword?.message}</Error>
        </InputField>

        <InputButton type="submit" value="Signup" />
        {/* {!isSuccess && <Error>{message}</Error>} */}
        
        <AuthLinkWrapper>
          Already have an account? &nbsp;
          <LoginLink onClick={() => setVisibility((prev) => !prev)}>
            Log in
          </LoginLink>
        </AuthLinkWrapper>
      </Form>
    </SignupWrapper>
  );
};

export default SignupForm;
