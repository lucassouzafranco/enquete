import React from 'react';
import './GraphCard.css';

export default function GraphCard() {
  const candidates = [
    { name: 'Marry Jane', percentage: 13, color: '#ff8fab', trend: 'up' },
    { name: 'John Doe', percentage: 31, color: '#f9d479', trend: 'up' },
    { name: 'Dr. Auzio', percentage: 56, color: '#82c7e2', trend: 'down' },
  ];

  return (
    <div className="graphCard">
      <div className="graphHeader">
        <h2>Visualização de Dados em Tempo Real</h2>
        <span className="liveBadge">live</span>
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
        <p>Total de votos: 3.035.131</p>
      </div>
    </div>
  );
} 