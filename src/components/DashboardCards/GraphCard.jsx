import React, { useState, useEffect } from 'react';
import './GraphCard.css';
import { setUpdateUICallback, calculatePercentages, getTotalVotes } from '../../socket/processMessage.js';

export default function GraphCard() {
  const [candidates, setCandidates] = useState([
    { name: 'Romário', percentage: 0, color: '#ff8fab', trend: 'up' },
    { name: 'Prefeito de Sorocaba', percentage: 0, color: '#f9d479', trend: 'up' },
    { name: 'Pastor Mirim', percentage: 0, color: '#82c7e2', trend: 'down' },
    { name: 'Pedro Damaso', percentage: 0, color: '#a8e6cf', trend: 'up' },
    { name: 'Tiririca', percentage: 0, color: '#ffb3ba', trend: 'down' },
  ]);

  const [totalVotes, setTotalVotes] = useState(0);

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
  }, []);

  return (
    <div className="graphCard">
      <div className="graphHeader">
      </div>
      <span className="liveBadge"></span>
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