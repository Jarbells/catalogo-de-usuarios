import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// IMPORTA A FUNÇÃO NOVA DA API
import { getUsers, getAllPosts } from '../services/api';

const USERS_PER_PAGE = 5;

// VOU SUBSTTITUIR POR CIDADES QUE EU CONHEÇO AQUI DO CEARÁ
// A API TEM 10 USUÁRIOS ID 1 A 10
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

// VOU USAR O COMPONENTE DE LOADING SEPARADO PARA REUTILIZAÇÃO
const LoadingSpinner = ({ text }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    <div className="loading-text">{text}</div>
  </div>
);

function Home() {
  const [users, setUsers] = useState([]); // GUARDAR A LISTA ORIGINAL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ESTADO PARA A CONTAGEM DE POSTS
  const [postCounts, setPostCounts] = useState({}); 

  // ESTADOS PARA OS FOLTROS
  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem('filterSearchTerm') || ''
  );
  const [selectedCity, setSelectedCity] = useState(
    () => localStorage.getItem('filterSelectedCity') || ''
  );

  // ESTADO PARA A PÁGINA ATUAL
  const [currentPage, setCurrentPage] = useState(1);

  // FUNÇÃO PARA BUSCAR OS DADOS
  const fetchUsersAndPosts = () => {
    setLoading(true);
    setError(null);

    // BUSCA USUÁRIOS E TODOS OS POSTS EM PARALELO
    Promise.all([getUsers(), getAllPosts()])
      .then(([usersData, allPostsData]) => {
        // MAPEAR OS USUÁRIOS PARA AS CIDADES DO CEARÁ
        const mappedUsers = usersData.map((user) => {
          // IDS DA API VÃO DE 1 A 10 E ARRAYS DE 0 A 9
          const cityIndex = user.id - 1;
          
          // SE O INDICE EXISTE NA LISTA TROCA A CIDADE
          if (cearaCities[cityIndex]) {
            user.address.city = cearaCities[cityIndex];
          }
          
          return user;
        });
        
        setUsers(mappedUsers); // ARMAZENA A LISTA COM AS CIDADES MODIFICADAS

        // PROCESSA A CONTAGEM DOS POSTS
        const counts = {};
        for (const post of allPostsData) {
          counts[post.userId] = (counts[post.userId] || 0) + 1;
        }
        setPostCounts(counts);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // RODA A FUNÇÃO DE BUSCA NA PRIMEIRA VEZ EM QUE O COMPONENTE É MONTADO
  useEffect(() => {
    fetchUsersAndPosts();
  }, []);

  // EFEITO PARA SALVAR FILTROS NO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('filterSearchTerm', searchTerm);
    localStorage.setItem('filterSelectedCity', selectedCity);
  }, [searchTerm, selectedCity]);

  // LÓGICA DO FILTRO
  // A LISTA DAS CIDADES AGORA É GERADA DINÂMICAMENTE A PARTIR DOS USUÁRIOS MAPEADOS
  const cities = [...new Set(users.map((user) => user.address.city))].sort();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === '' || user.address.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  // EFEITO PARA RESETAR A PÁGINA QUANDO MUDAR O FILTRO
  useEffect(() => {
    setCurrentPage(1); // VOLTA PARA A PÁGINA 1 TODA VEZ QUE A BUSCA-FILTRO MUDAR
  }, [searchTerm, selectedCity]);

  // PARTE DA LÓGICA DE PAGINAÇÃO
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);
  
  if (loading) {
    // USA O COMPONENTE SPINNER
    return <LoadingSpinner text="Carregando usuários..." />;
  }

  if (error) {
    return (
      <div className="error">
        Erro ao carregar usuários: {error}
        <button className="button" onClick={fetchUsersAndPosts}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2>Lista de Usuários</h2>

      {/* CONTÊINER DE FILTROS */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="search">Buscar por Nome ou E-mail</label>
          <input
            type="text"
            id="search"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="city">Filtrar por Cidade</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Todas as Cidades</option>
            {/* O "SELECT" AGORA MOSTRA AS CIDADES DO CEARÁ */}
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOSTRAR A CONTAGEM BASEADO NOS USUÁRIOS FILTRADOS, NÃO PAGINADOS */}
      <div className="results-count">
        Exibindo {filteredUsers.length} de {users.length} usuários.
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Cidade</th> {/* AGORA MOSTRA O CEARÁ */}
            <th>Total de Posts</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* FAZ O .MAP() NA LISTA PAGINADA */}
          {usersToDisplay.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address.city}</td> {/* CÉLULA ATUALIZADA */}
              <td className="posts-count-cell">
                {postCounts[user.id] || 0}
              </td>
              <td>
                <Link to={`/usuario/${user.id}`} className="button">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CONTROLES DE PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1} // DESABILITA NA PRIMEIRA PÁGINA
          >
            Anterior
          </button>
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages} // DESABILITA NA ÚLTIMA PÁGINA
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;