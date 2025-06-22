import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import Menu from '../components/Menu/Menu';
import Footer from '../components/Footer/Footer';
import VotedCard from '../components/DashboardCards/VotedCard';
import GraphCard from '../components/DashboardCards/GraphCard';
import { initializeVoteData, getVoteData } from '../socket/processMessage.js';
import { loadVoteData, hasSavedData } from '../service/localstorage.js';

export default function Dashboard() {
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard: Iniciando carregamento de dados...');
    
    // Inicializa os dados de votação do localStorage
    initializeVoteData();
    
    // Verifica se há dados salvos
    const hasData = hasSavedData();
    console.log('Dashboard: Há dados salvos?', hasData);
    
    if (hasData) {
      const savedVoteData = loadVoteData();
      console.log('Dashboard: Dados carregados do localStorage:', savedVoteData);
    }
    
    // Tenta carregar o candidato votado do localStorage
    const savedCandidate = localStorage.getItem('votedCandidate');
    if (savedCandidate) {
      console.log('Dashboard: Candidato votado carregado:', savedCandidate);
      setVotedCandidate(JSON.parse(savedCandidate));
    } else {
      console.log('Dashboard: Nenhum candidato votado encontrado');
    }
    
    setIsDataLoaded(true);
  }, []);

  const handleReturnToHome = () => {
    // Limpa o voto ao retornar para a página inicial
    localStorage.removeItem('votedCandidate');
    navigate('/');
  };

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <div className="dashboardPage">
      <Menu />
      <div className="dashboardContent">
        <h1>Você votou! Aqui estão dados sobre os candidatos</h1>
        <div className="cardsContainer">
          {votedCandidate && (
            <VotedCard 
              votedCandidate={votedCandidate} 
              selectedPokemon={selectedPokemon}
            />
          )}
          <GraphCard onPokemonSelect={handlePokemonSelect} />
        </div>
        <div className="dashboardActions">
          <button className="returnButton" onClick={handleReturnToHome}>
            retornar ao início
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
