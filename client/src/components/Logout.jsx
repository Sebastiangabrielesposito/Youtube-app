import React from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../axios/axiosConfig"
import axios from 'axios';
import {loginFailure, loginStart, loginSuccess,logout} from '../redux/userSlice'
import { async } from "@firebase/util";
import styled from 'styled-components';


const Logout = styled.button`
  background-color: red;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 5px 10px;
  cursor: pointer;
`;


const LogoutButton = () => {
    const dispatch = useDispatch();
    
    const handleLogout = async(e) => {
    e.preventDefault()
    try {
        const res = await axiosInstance.post("api/auth/logout")
        dispatch(logout());  
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        dispatch(loginFailure());
    }    

}
  return (
    <Logout onClick={handleLogout}>Logout</Logout>
  );
};

export default LogoutButton;
