import React, { useState, useEffect } from 'react';
import './VotedCard.css';
import { setUpdateVotedCardCallback, setUserVotedCandidate, getCandidateData } from '../../socket/processMessage.js';

export default function VotedCard({ votedCandidate }) {
  const [candidateData, setCandidateData] = useState({
    votes: 0,
    percentage: 0,
    totalVotes: 0
  });

  // Função para atualizar os dados do candidato votado
  const updateCandidateData = (candidate, voteData) => {
    if (candidate && candidate.name) {
      const data = getCandidateData(candidate.name);
      setCandidateData(data);
    }
  };

  useEffect(() => {
    // Configurar o callback para atualização da UI
    setUpdateVotedCardCallback(updateCandidateData);
    
    // Se há um candidato votado, configurar e atualizar dados
    if (votedCandidate) {
      setUserVotedCandidate(votedCandidate);
      const data = getCandidateData(votedCandidate.name);
      setCandidateData(data);
    }
  }, [votedCandidate]);

  // Se não houver candidato votado, não renderiza o card
  if (!votedCandidate) {
    return null;
  }

  return (
    <div className="votedCard">
      <img src={votedCandidate.img} alt={votedCandidate.name} className="votedAvatar" />
      <h3 className="votedName">{votedCandidate.name}</h3>
      <p className="votedVotes">{candidateData.votes.toLocaleString()} votos</p>
      <div className="votedStats">
        <p className="growth">{candidateData.percentage}% dos votos totais</p>
      </div>
    </div>
  );
} 