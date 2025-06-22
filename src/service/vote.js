import api from './api';

export const submitVote = async (pokemonId) => {
  try {
    const response = await api.post('/submit', {
      pokemon_id: pokemonId
    });
    
    return {
      success: true,
      message: 'Voto enviado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao enviar voto:', error);
    return {
      success: false,
      message: 'Erro ao enviar voto. Tente novamente.'
    };
  }
};

// Constantes para os IDs dos Pokémon
export const POKEMON_IDS = {
  BULBASAUR: 1,
  CHARMANDER: 4,
  SQUIRTLE: 7,
  PIKACHU: 25,
  EEVEE: 133
};