import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, styled } from '@mui/material';
import { PostDetails } from '@/models/index';

interface PostDetailProps {
  id: string;
}

const BackButtonWrapper = styled('div')(() => ({
  paddingTop: '1rem',
}));

const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  const [postDetails, setPostDetails] = useState<PostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}`
        );
        setPostDetails(response.data);
      } catch (error) {
        console.error('Error al obtener detalles del post:', error);
        setError(
          'Error al obtener detalles del post. Por favor, inténtalo de nuevo.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading) {
    return (
      <Typography variant="body2">Cargando detalles del post...</Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    );
  }

  if (!postDetails) {
    return (
      <Typography variant="body2">
        No se encontraron detalles del post.
      </Typography>
    );
  }

  return (
    <div>
      <h2>{postDetails.title}</h2>
      <p>Autor: {postDetails.author}</p>
      <p>Fecha de publicación: {postDetails.creationDate}</p>
      <p>{postDetails.content}</p>
    </div>
  );
};

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  if (!id) {
    return;
  }

  return (
    <div>
      <h1>Detalles de la entrada</h1>
      <PostDetail id={id} />
      <BackButtonWrapper>
        <Button variant="outlined" color='secondary' onClick={() => history.back()}>
          Volver
        </Button>
      </BackButtonWrapper>
    </div>
  );
};

export default PostDetailPage;
