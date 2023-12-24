import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Typography,
  styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Navbar } from '@/components';
import { PostDetails } from '@/models/index';

interface MaterialCardProps {
  data: PostDetails;
  onViewMore: (id: number) => void;
}

const CreationButtonWrapper = styled('div')(() => ({
  position: 'fixed',
  top: '0',
  right: '0',
  paddingTop: '5rem',
  paddingRight: '1rem',
}));

const MaterialCard: React.FC<MaterialCardProps> = ({ data, onViewMore }) => (
  <Card sx={{ maxWidth: 1200, marginBottom: '1rem' }}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {data.title}
      </Typography>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {data.author}
      </Typography>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {data.creationDate}
      </Typography>
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '70ch',
        }}
        variant="body2"
        color="text.secondary"
      >
        {data.content}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={() => onViewMore(data.id)}>
        Leer más
      </Button>
    </CardActions>
  </Card>
);

const MaterialCardList: React.FC<{
  data: PostDetails[];
  onViewMore: (id: number) => void;
}> = ({ data, onViewMore }) => (
  <div>
    {data.map((item) => (
      <MaterialCard key={item.id} data={item} onViewMore={onViewMore} />
    ))}
  </div>
);

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostDetails[]>([]); // Nuevo estado para las entradas filtradas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PostDetails[]>(
          'http://localhost:3000/api/v1/posts'
        );
        setPosts(response.data);
        setFilteredPosts(response.data); // Inicialmente, las entradas filtradas son las mismas que las entradas originales
      } catch (error) {
        console.error('Error al obtener posts:', error);
        setError('Error al obtener posts. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Este efecto se ejecutará solo una vez al montar el componente

  const handleSearchChange = (searchTerm: string) => {
    // Filtrar las entradas basándose en el término de búsqueda
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    console.log('Probando el buscador: ', filtered);
  };

  const handleViewMore = (id: number) => {
    const post = filteredPosts.find((p) => p.id === id);
    if (post) {
      navigate(`/post/${post.id}`);
    }
  };

  return (
    <div>
      <CreationButtonWrapper>
        <Fab
          color="secondary"
          variant="extended"
          aria-label="add"
          onClick={() => navigate('/create')}
        >
          <AddIcon />
          Crear entrada
        </Fab>
      </CreationButtonWrapper>
      <Navbar onSearchChange={handleSearchChange} />
      {loading && <Typography variant="body2">Cargando posts...</Typography>}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <MaterialCardList data={filteredPosts} onViewMore={handleViewMore} />
      )}
    </div>
  );
};

export default BlogPage;
