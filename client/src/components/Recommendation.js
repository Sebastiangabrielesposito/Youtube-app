import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import axiosInstance from "../axios/axiosConfig"

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  const [currentVideoId, setCurrentVideoId] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axiosInstance.get(`/api/videos/tags?tags=${tags}`);
      setVideos(res.data);
      // console.log(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;