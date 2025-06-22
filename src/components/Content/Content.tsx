import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Content.css";
import Cards from "../Cards/Cards";
import { setUserVotedCandidate } from "../../socket/processMessage.js";
import { submitVote, POKEMON_IDS } from "../../service/vote.js";

interface Candidate {
    id: number;
    name: string;
    img: string;
}

export default function Content() {
    const [votedCandidate, setVotedCandidate] = useState<Candidate | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const titleText = votedCandidate
        ? `Confirmação do Voto`
        : "Escolha o seu pokemon favorito(a)";

    const handleConfirmVote = async () => {
        if (votedCandidate && !isSubmitting) {
            setIsSubmitting(true);
            
            try {
                // Mapear o ID do candidato para o ID correto do Pokémon
                const pokemonIdMap = {
                    1: POKEMON_IDS.BULBASAUR,    // Bulbasauro
                    2: POKEMON_IDS.PIKACHU,      // Pikachu
                    3: POKEMON_IDS.CHARMANDER,   // Charmander
                    4: POKEMON_IDS.SQUIRTLE,     // Squirtle
                    5: POKEMON_IDS.EEVEE         // Eevee
                };
                
                const pokemonId = pokemonIdMap[votedCandidate.id];
                
                if (!pokemonId) {
                    throw new Error('ID do Pokémon não encontrado');
                }
                
                const result = await submitVote(pokemonId);
                
                if (result.success) {
                    // Salvar o candidato votado no localStorage para persistir entre páginas
                    localStorage.setItem('votedCandidate', JSON.stringify(votedCandidate));
                    
                    // Registrar o candidato votado no sistema WebSocket
                    setUserVotedCandidate(votedCandidate);
                    
                    navigate('/dashboard');
                } else {
                    alert(result.message || 'Erro ao enviar voto');
                }
            } catch (error) {
                console.error('Erro ao enviar voto:', error);
                alert('Erro ao enviar voto. Tente novamente.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="contentBackground">
            <div className="contentContainer">
                <div className="contentTitle">
                    <p>{titleText}</p>
                </div>

                <div className="content">
                    <Cards 
                        votedCandidate={votedCandidate}
                        setVotedCandidate={setVotedCandidate}
                        onConfirmVote={handleConfirmVote}
                        isSubmitting={isSubmitting}
                    />
                </div>

                {votedCandidate && (
                    <div className="contentSubtitle">
                        <p>Verifique se o nome e a imagem se encaixam com o do seu pokemon preferido.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
