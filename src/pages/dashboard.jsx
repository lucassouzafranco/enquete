import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import Menu from '../components/Menu/Menu';
import Footer from '../components/Footer/Footer';
import VotedCard from '../components/DashboardCards/VotedCard';
import GraphCard from '../components/DashboardCards/GraphCard';
import { initializeVoteData } from '../socket/processMessage.js';

export default function Dashboard() {
  const [votedCandidate, setVotedCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializa os dados de votação do localStorage
    initializeVoteData();
    
    // Tenta carregar o candidato votado do localStorage
    const savedCandidate = localStorage.getItem('votedCandidate');
    if (savedCandidate) {
      setVotedCandidate(JSON.parse(savedCandidate));
    }
  }, []);

  const handleReturnToHome = () => {
    // Limpa o voto ao retornar para a página inicial
    localStorage.removeItem('votedCandidate');
    navigate('/');
  };

  return (
    <div className="dashboardPage">
      <Menu />
      <div className="dashboardContent">
        <h1>Você votou! Aqui estão dados sobre os candidatos</h1>
        <div className="cardsContainer">
          {votedCandidate && <VotedCard votedCandidate={votedCandidate} />}
          <GraphCard />
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
