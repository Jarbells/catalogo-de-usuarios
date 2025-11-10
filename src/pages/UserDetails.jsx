import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getUserPosts } from '../services/api';
import Modal from '../components/Modal'; // IMPORTA O MODAL

const cearaCities = [
  'Quixadá',
  'Fortaleza',
  'Juazeiro do Norte',
  'Sobral',
  'Crato',
  'Itapipoca',
  'Maracanaú',
  'Caucaia',
  'Iguatu',
  'Canindé',
];

// COMPONENTE DE LOADING
const LoadingSpinner = ({ text }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <div className="loading-text">{text}</div>
  </div>
);

function UserDetails() {
  // PEGA O ID DA URL POR EXEMPLO: /USUARIO/1
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ESTADO PARA CONTROLAR QUAL POST ESTÁ SELECIONADO PARA O MODAL
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // BUSCA DADOS DO USUÁRIO E SEUS POSTS AO MESMO TEMPO
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // USA PROMISSE.ALL PARA AS DUAS REQUISIÇÕES
        const [userData, postsData] = await Promise.all([
          getUser(id),
          getUserPosts(id),
        ]);

        // MAPEIA A CIDADE DO USUÁRIO
        const cityIndex = userData.id - 1;
        if (cearaCities[cityIndex]) {
          userData.address.city = cearaCities[cityIndex];
        }
                
        setUser(userData); // SETA O USUÁRIO COM A CIDADE MODIFICADA
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // RODA SEMPRE QUE O ID NA URL MUDAR

  if (loading) {
    // USA O SPINNER
    return <LoadingSpinner text="Carregando dados do usuário..." />;
  }

  if (error) {
    return <div className="error">Erro ao carregar dados: {error}</div>;
  }

  // SE NÃO TEM USUÁRIO DEPOIS DE CARREGAR, NÃO MOSTRA NADA
  if (!user) {
    return null;
  }

  // FORMATA O ENDEREÇO AGORA COM AS CIDADES DO CEARÁ
  const address = `${user.address.street}, ${user.address.suite}, ${user.address.city} - ${user.address.zipcode}`;

  return (
    <div className="page-content">
      <Link to="/" className="button-back">
        &larr; Voltar para a lista
      </Link>

      <h2>{user.name}</h2>
      <p>@{user.username}</p>

      {/* EXIBE INFORMAÇÕES COMPLETAS */}
      <div className="user-details-grid">
        <div className="detail-item">
          <label>E-mail</label>
          {user.email}
        </div>
        <div className="detail-item">
          <label>Telefone</label>
          {user.phone}
        </div>
        <div className="detail-item">
          <label>Empresa</label>
          {user.company.name}
        </div>
        <div className="detail-item">
          <label>Website</label>
          <a
            href={`http://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {user.website}
          </a>
        </div>
        <div className="detail-item detail-item-full">
          <label>Endereço</label>
          {address} {/* ENDEREÇO ATUALIZADO */}
        </div>
      </div>

      {/* EXIBE POSTS */}
      <div className="posts-container">
        <h3>Posts do Usuário ({posts.length})</h3> {/* PARTE BÔNUS CONTAGEM NESSE PEDAÇO */}
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <h4>{post.title}</h4>
              <button
                className="button-secondary"
                onClick={() => setSelectedPost(post)} // ABRE O MODAL
              >
                Ver conteúdo
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* O MODAL SÓ VAI APARECER SE "SELECTEDPOST" NÃO FOR NULO */}
      <Modal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}

export default UserDetails;