import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosConfig";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    signupStart: (state) => {
      state.loading = true;
    },
    signupFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    updateProfileImageStart: (state) => {
      state.loading = true;
    },
    updateProfileImageSuccess: (state, action) => {
      state.loading = false;
      state.currentUser.img = action.payload; 
    },
    updateProfileImageFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    subscription: (state, action) => {
      if (state.currentUser.subscribedUsers.includes(action.payload)) {
        state.currentUser.subscribedUsers.splice(
          state.currentUser.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        state.currentUser.subscribedUsers.push(action.payload);
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, signupStart,    signupFailure, signupSuccess, subscription, updateProfileImageStart, updateProfileImageSuccess,
updateProfileImageFailure} =
  userSlice.actions;

  export const uploadProfileImageToServer = (id, file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
  
    return axiosInstance.post(`http://localhost:8080/api/users/upload-profile-image/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
  };



export default userSlice.reducer;