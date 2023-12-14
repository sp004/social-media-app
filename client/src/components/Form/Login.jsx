import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, userLogin } from "../../features/auth/authSlice";
import {
  AuthLinkWrapper,
  Error,
  ForgetPassword,
  Form,
  Header,
  InputButton,
  InputField,
  InputText,
  LinkWrapper,
  P,
  ShowPwd,
  SignupLink,
  Wrapper,
} from "./styles";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";

const Login = ({ setVisibility }) => {
  document.title = 'MeetFrends - Login'
  const [showPassword, setShowPassword] = useState(false)
  const [showCredential, setShowCredential] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: ""
    },
    mode: "onTouched"
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, isLoading, message } = useSelector((state) => state.auth);

  const loginHandler = useCallback(async (data) => {
    await dispatch(userLogin(data));
    await dispatch(reset())
  }, [dispatch]);

  
  useEffect(() => {
    if (message === 'Login successful') {
      navigate("/feed");
    }
  }, [isSuccess, isLoading, navigate]);

  useEffect(() => {
    if(!isSuccess && message){
      toast.error(message, {
        duration: 2000,
      })
    }
  }, [isSuccess, message])

  return (
    <Wrapper>
      <Header>Login</Header>
      <Form onSubmit={handleSubmit(loginHandler)}>
        <InputField>
          <InputText
            type="text"
            placeholder="Email or Username"
            {...register("emailOrUsername", {
              required: "Username or Email is required",
            })}
          />
          <Error>{errors.emailOrUsername?.message}</Error>
        </InputField>

        <InputField>
          <div style={{position: 'relative'}}>
            <InputText
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
        </InputField>
        <Error>{errors.password?.message}</Error>

        <InputButton type="submit" value="Login" />
      </Form>
      <LinkWrapper>
        <ForgetPassword to="/forget-password">Forget Password</ForgetPassword>
        <AuthLinkWrapper>
          Not Registered Yet?&nbsp;
          <SignupLink onClick={() => setVisibility((prev) => !prev)}>
            Signup
          </SignupLink>
        </AuthLinkWrapper>
      </LinkWrapper>
      <div>
        <h5 style={{color: "#a435f0", cursor: "pointer", marginTop: '12px', fontSize: '1rem', background: '#fff', padding: '6px'}} onClick={() => setShowCredential(prev => !prev)}>{!showCredential ? 'Show' : 'Hide'} Test Credentials</h5>
        {showCredential && 
        <code style={{textAlign: 'left'}}>
          <p><b>Username:</b> test</p>
          <p><b>Email:</b> test@gmail.com</p>
          <p><b>Password:</b> test123</p>
        </code>}
      </div>
    </Wrapper>
  );
};

export default Login;
