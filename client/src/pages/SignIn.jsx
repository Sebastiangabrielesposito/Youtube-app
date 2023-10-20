import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess, signupStart, signupFailure, signupSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import {signInWithPopup} from "firebase/auth"
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";





const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null)
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async(e)=>{
    e.preventDefault();
    dispatch(loginStart())
    try {
      const res = await axios.post(`api/auth/signin`, {name, password}, { withCredentials: true })
      dispatch(loginSuccess(res.data))
      navigate("/");   
    } catch (error) {
      console.log(error);
      dispatch(loginFailure())
    }
  }


  const signInWithGoogle = async() => {
    dispatch(loginStart())
    signInWithPopup(auth, provider).then((result) => {
      const googleUser = {
        name: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
      };
  
      axios.post("api/auth/google", googleUser).then((res) => {
        const userData = res.data;
  
        
        const updatedCurrentUser = {
          ...userData,
          img: googleUser.img, 
        };
  
        dispatch(loginSuccess(updatedCurrentUser));
        console.log(updatedCurrentUser);
        navigate("/");
      })
    }).catch((res) => {
      dispatch(loginFailure())
    })
  }
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file)
  }

  const defaultProfileImage = "default-profile-image.jpg"

  const handleSignup = async(e) => {
    e.preventDefault();
    dispatch(signupStart());

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("img", selectedImage); 
    

      const res = await axios.post(`/api/auth/signup`,
      formData, { withCredentials: true, headers: {
        "Content-Type": "multipart/form-data", 
      }, })
      dispatch(signupSuccess(res.data))
      navigate("/"); 
    } catch (error) {
      console.log(error);
      dispatch(signupFailure())
    }
  }


  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to SegaTube</SubTitle>
        <Input placeholder="username" onChange={e=>setName(e.target.value)}/>
        <Input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Singin with Google</Button>
        <Title>or</Title>
        <Input placeholder="username" onChange={e=>setName(e.target.value)}/>
        <Input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
        <Input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
        <Input type="file"  placeholder="Chosse a file" onChange={handleImageChange}/>
        <Button onClick={handleSignup}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
