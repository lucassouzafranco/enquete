import React, { useState, useEffect } from 'react';
import './GraphCard.css';
import { setUpdateUICallback, calculatePercentages, getTotalVotes, getVoteData } from '../../socket/processMessage.js';
import wsClient from '../../socket/wsclient.js';

export default function GraphCard({ onPokemonSelect }) {
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

  // Função para lidar com clique no nome do Pokémon
  const handlePokemonClick = (pokemonName) => {
    // Mapear nomes para dados completos dos Pokémon com GIFs da API
    const pokemonData = {
      'Bulbasauro': { name: 'Bulbasauro', img: 'https://projectpokemon.org/images/normal-sprite/bulbasaur.gif' },
      'Pikachu': { name: 'Pikachu', img: 'https://projectpokemon.org/images/normal-sprite/pikachu.gif' },
      'Charmander': { name: 'Charmander', img: 'https://projectpokemon.org/images/normal-sprite/charmander.gif' },
      'Squirtle': { name: 'Squirtle', img: 'https://projectpokemon.org/images/normal-sprite/squirtle.gif' },
      'Eevee': { name: 'Eevee', img: 'https://projectpokemon.org/images/normal-sprite/eevee.gif' }
    };

    const selectedPokemon = pokemonData[pokemonName];
    if (selectedPokemon && onPokemonSelect) {
      onPokemonSelect(selectedPokemon);
    }
  };

  useEffect(() => {
    // Configurar o callback para atualização da UI
    setUpdateUICallback(updateUI);
    
    // Carregar dados iniciais do localStorage
    const initialData = getVoteData();
    if (initialData) {
      updateUI(initialData);
    }
    
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
              <span 
                className="pokemonName"
                onClick={() => handlePokemonClick(candidate.name)}
                style={{ cursor: 'pointer' }}
              >
                {candidate.name}
              </span>
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