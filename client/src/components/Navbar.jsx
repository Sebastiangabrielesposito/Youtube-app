import React, { useState, useRef } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Upload from "./Upload";
import LogoutButton from "../components/Logout"
import { current } from "@reduxjs/toolkit";
import {updateProfileImageStart, uploadProfileImageToServer, updateProfileImageFailure, updateProfileImageSuccess  } from "../redux/userSlice";


const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 20px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;


const User = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:500;
  color: ${({theme}) => theme.text};
`

const Avatar = styled.img`
width:32px;
height: 32px;
border-radius:50%;
background-color: #999;
object-fit: cover;
cursor: pointer;
`
const ProfileImageInput = styled.input`
  display: none; 
`;


const Navbar = () => {

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const {currentUser} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [newImage, setNewImage] = useState(null);

  const defaultProfileImage = "/default-profile-image.jpg"
 
  const imageUrl = currentUser && `/${currentUser.img}`;

  const handleImageClick = () => {
    inputRef.current.click();
  }  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    if (file) {
      dispatch(updateProfileImageStart());
      uploadProfileImageToServer(currentUser._id, file)
      .then((response) => {
        // console.log('Upload successful:', response.data);
        dispatch(updateProfileImageSuccess(response.data.img));
      })
      .catch((error) => {
        console.log("Upload error: " , error);
        dispatch(updateProfileImageFailure());
      });
    }
};
// console.log(currentUser);
  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input placeholder="Search" onChange={(e) => setQ(e.target.value) } />
            <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)}/>
          </Search>
        {currentUser ? (
          <User>
            <VideoCallOutlinedIcon onClick={() => setOpen(true)}/>
            <Avatar 
              src={ imageUrl}
              alt="Profile Image"
              onClick={handleImageClick} 
            />
            <ProfileImageInput
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleImageChange} 
            />
            {currentUser.name}
            { currentUser && <LogoutButton />}
          </User>
        ) : <Link to="signin" style={{ textDecoration: "none" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
