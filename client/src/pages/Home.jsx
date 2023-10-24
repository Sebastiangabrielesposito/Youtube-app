import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios"
import axiosInstance from "../axios/axiosConfig"

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type }) => {

  const videoType = type || "random"
  const  [videos, setVideos] = useState([])

  useEffect(()=>{
    console.log("Valor de 'type':", type);
    
    const fetchVideos = async ()=>{
      try {
        const res = await axios.get(`/api/videos/${videoType}` , { withCredentials: true })
        setVideos(res.data)
        console.log(res.data);
      } catch (error) {
        console.log("Error al cargar los videos", error);
      }
    }
    
    fetchVideos()
  },[videoType])
  
  // console.log(type);

  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video} />
      ))}
     
    </Container>
  );
};

export default Home;
