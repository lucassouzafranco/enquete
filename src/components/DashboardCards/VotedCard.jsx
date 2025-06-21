import React from 'react';
import './VotedCard.css';

export default function VotedCard({ votedCandidate }) {
  if (!votedCandidate) {
    return null;
  }

  return (
    <div className="votedCard">
      <img src={votedCandidate.img} alt={votedCandidate.name} className="votedAvatar" />
      <h3 className="votedName">{votedCandidate.name}</h3>
      <p className="votedVotes">394.567 votos</p>
      <div className="votedStats">
        <p className="lastMinuteVotes">+3129 votos no último minuto</p>
        <p className="growth">6% de crescimento no fluxo de votos</p>
      </div>
    </div>
  );
} 