import React from 'react';
import './GraphCard.css';

export default function GraphCard() {
  const candidates = [
    { name: 'Romário', percentage: 13, color: '#ff8fab', trend: 'up' },
    { name: 'Prefeito de Sorocaba', percentage: 31, color: '#f9d479', trend: 'up' },
    { name: 'Pastor Mirim', percentage: 56, color: '#82c7e2', trend: 'down' },
    { name: 'Pedro Damaso', percentage: 8, color: '#a8e6cf', trend: 'up' },
    { name: 'Tiririca', percentage: 12, color: '#ffb3ba', trend: 'down' }, 
  ];

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
        <p>Total de votos: 3.035.131</p>
      </div>
    </div>
  );
} 