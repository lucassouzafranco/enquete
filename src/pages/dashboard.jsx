import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import Menu from '../components/Menu/Menu';
import Footer from '../components/Footer/Footer';
import VotedCard from '../components/DashboardCards/VotedCard';
import GraphCard from '../components/DashboardCards/GraphCard';

export default function Dashboard() {
  const [votedCandidate, setVotedCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCandidate = localStorage.getItem('votedCandidate');
    if (savedCandidate) {
      setVotedCandidate(JSON.parse(savedCandidate));
    }
  }, []);

  const handleReturnToHome = () => {
    localStorage.removeItem('votedCandidate');
    navigate('/');
  };

  return (
    <div className="dashboardPage">
      <Menu />
      <div className="dashboardContent">
        <h1>Você votou! Aqui estão dados sobre os candidatos</h1>
        <div className="cardsContainer">
          <VotedCard votedCandidate={votedCandidate} />
          <GraphCard />
        </div>
        <button className="returnButton" onClick={handleReturnToHome}>
          retornar ao início
        </button>
      </div>
      <Footer />
    </div>
  );
}
