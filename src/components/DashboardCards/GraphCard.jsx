import React, { useState, useEffect } from 'react';
import './GraphCard.css';
import { setUpdateUICallback, calculatePercentages, getTotalVotes } from '../../socket/processMessage.js';
import wsClient from '../../socket/wsclient.js';

export default function GraphCard() {
  const [candidates, setCandidates] = useState([
    { name: 'Bulbasauro', percentage: 0, color: '#4ade80', trend: 'up' },
    { name: 'Pikachu', percentage: 0, color: '#fbbf24', trend: 'up' },
    { name: 'Charmander', percentage: 0, color: '#f87171', trend: 'down' },
    { name: 'Squirtle', percentage: 0, color: '#60a5fa', trend: 'up' },
    { name: 'Eevee', percentage: 0, color: '#a0522d', trend: 'down' },
  ]);

  const [totalVotes, setTotalVotes] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Função para atualizar a UI com novos dados
  const updateUI = (voteData) => {
    const percentages = calculatePercentages();
    const total = getTotalVotes();
    
    setCandidates(prevCandidates => 
      prevCandidates.map(candidate => ({
        ...candidate,
        percentage: percentages[candidate.name] || 0
      }))
    );
    
    setTotalVotes(total);
  };

  useEffect(() => {
    // Configurar o callback para atualização da UI
    setUpdateUICallback(updateUI);
    
    // Atualização inicial
    updateUI();
    
    // Verificar status da conexão a cada segundo
    const checkConnection = () => {
      setIsConnected(wsClient.isConnected());
    };
    
    checkConnection();
    const connectionInterval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(connectionInterval);
    };
  }, []);

  return (
    <div className="graphCard">
      <div className="graphHeader">
      </div>
      <div className="connectionStatus">
        <span className={`liveBadge ${isConnected ? 'connected' : 'disconnected'}`}></span>
        {isConnected ? (
          <span className="connectedText">Conectado</span>
        ) : (
          <span className="disconnectedText">Desconectado</span>
        )}
      </div>
      <div className="graphContent">
        {candidates.map((candidate) => (
          <div className="candidateBar" key={candidate.name}>
            <div className="candidateInfo">
              <span>{candidate.name}</span>
            </div>
            <div className="progressBarContainer">
              <div
                className="progressBar"
                style={{ width: `${candidate.percentage}%`, backgroundColor: candidate.color }}
              >
                <span 
                  className="percentageText" 
                  style={{ color: candidate.color }}
                >
                  {candidate.percentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="graphFooter">
        <p>Total de votos: {totalVotes.toLocaleString()}</p>
      </div>
    </div>
  );
} 