import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axiosInstance from "../axios/axiosConfig"
import {useSelector} from 'react-redux';


const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;


const Enviar = styled.button`
  background-color: #4b4b4b;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;


const DeleteButton = styled.button`
  background-color: #4b4b4b;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 5px 15px;
  cursor: pointer;
  margin-left: 20px; 
  border-radius:10px;
`;


const Comments = ({videoId}) => {

  const {currentUser} = useSelector((state) => state.user);
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`http://localhost:8080/api/comments/${videoId}`)
        setComments(res.data)
      } catch (error) {
        
      }
    }
    fetchComments()
  },[videoId])

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      return;
    }
    
    try {
      const res = await axiosInstance.post(`http://localhost:8080/api/comments`, {
        desc: newComment,
        videoId: videoId,
      });
      
      setComments((prevComments) => [...prevComments, res.data]);

      setNewComment("");
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      
      await axiosInstance.delete(`http://localhost:8080/api/comments/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  const defaultProfileImage = "/default-profile-image.jpg"

  const imageUrl = currentUser && `http://localhost:8080/${currentUser.img}`;

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img == "" ? defaultProfileImage :  imageUrl} />
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Enviar onClick={handleAddComment}>Enviar</Enviar>
      </NewComment>
      
      {comments.map((comment) => (
        
        <div key={comment._id}>
          <Avatar src={comment.userId.img} />
          <span>{comment.desc}</span>
          {comment.userId === currentUser._id && ( 
             <DeleteButton onClick={() => handleDeleteComment(comment._id)}>Eliminar</DeleteButton>
          )}
        </div>
      ))}
    </Container>
  );
};

export default Comments;
