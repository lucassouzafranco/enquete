import React, { useState, useEffect } from 'react';
import './VotedCard.css';
import { setUpdateVotedCardCallback, setUserVotedCandidate, getCandidateData } from '../../socket/processMessage.js';

export default function VotedCard({ votedCandidate, selectedPokemon }) {
  const [candidateData, setCandidateData] = useState({
    votes: 0,
    percentage: 0,
    totalVotes: 0
  });

  // Determina qual Pokémon mostrar (selecionado ou votado)
  const displayPokemon = selectedPokemon || votedCandidate;

  // Função para atualizar os dados do candidato
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
    }
  }, [votedCandidate]);

  // Atualizar dados quando o Pokémon de exibição mudar
  useEffect(() => {
    if (displayPokemon) {
      const data = getCandidateData(displayPokemon.name);
      setCandidateData(data);
    }
  }, [displayPokemon]);

  // Se não houver candidato votado, não renderiza o card
  if (!votedCandidate) {
    return null;
  }

  // Se não houver Pokémon para exibir, não renderiza o card
  if (!displayPokemon) {
    return null;
  }

  return (
    <div className="votedCard">
      <img src={displayPokemon.img} alt={displayPokemon.name} className="votedAvatar" />
      <h3 className="votedName">{displayPokemon.name}</h3>
      <p className="votedVotes">{candidateData.votes.toLocaleString()} votos</p>
      <div className="votedStats">
        <p className="growth">{candidateData.percentage}% dos votos totais</p>
      </div>
    </div>
  );
} 