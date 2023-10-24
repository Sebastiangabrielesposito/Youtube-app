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
  margin-bottom: 10px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
  margin-top:12px;
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
  /* background-color: #4b4b4b; */
  background-color:red;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 5px 15px;
  cursor: pointer;
  margin-left: 500px; 
  margin-top: 20px;
  border-radius:10px;
`;

const DivComment = styled.div`
  display:flex;
  align-items: center;
  margin-top: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
`

const Comments = ({videoId}) => {

  const {currentUser} = useSelector((state) => state.user);
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("");
  const [userImages, setUserImages] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/api/comments/${videoId}`)
        setComments(res.data)
        
        const uniqueUserIds = [...new Set(res.data.map(comment => comment.userId))]
        const imagesMap = {};

        uniqueUserIds.forEach(async userId => {
          try {
            const userRes = await axiosInstance.get(`/api/users/find/${userId}`);
            imagesMap[userId] = userRes.data.img;
          } catch (error) {
            console.error("Error al obtener la imagen del usuario:", error);
            imagesMap[userId] = null;
          }
        });
  
        setUserImages(imagesMap);


      } catch (error) {
          console.error("Error al obtener los comentarios:", error);
      }
    }
    fetchComments()
  },[videoId])



  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      return;
    }
    
    try {
      const res = await axiosInstance.post(`/api/comments`, {
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
      
      await axiosInstance.delete(`/api/comments/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  const defaultProfileImage = "/default-profile-image.jpg"
  const imageUrl = currentUser ? `/${currentUser.img}` : `${defaultProfileImage}`;
  
  // const imageCommentUrl = `http://localhost:8080/`;

  const imageCommentUrl = `https://youtube-server-mu.vercel.app/`;
  
 

  // console.log(currentUser.img);
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img == "" ? defaultProfileImage :  imageUrl} />
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Enviar onClick={handleAddComment}>Enviar</Enviar>
      </NewComment>
      
      {comments.map((comment) => (
        
        <DivComment key={comment._id} >
          <Avatar src={imageCommentUrl + userImages[comment.userId]
      }/>
            
            <span style={{marginLeft:"20px", marginTop:"20px"}}>{comment.desc}</span>
            {comment.userId === currentUser?._id && ( 
              <DeleteButton onClick={() => handleDeleteComment(comment._id)}>Eliminar</DeleteButton>
            )}
          
        </DivComment>
      ))}
    </Container>
  );
};

export default Comments;
