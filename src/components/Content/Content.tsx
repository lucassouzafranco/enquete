import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Content.css";
import Cards from "../Cards/Cards";

export default function Content() {
    const [votedCandidate, setVotedCandidate] = useState(null);
    const navigate = useNavigate();

    const titleText = votedCandidate
        ? `Confirmação do Voto`
        : "Escolha o seu candidato(a) favorito(a)";

    const handleConfirmVote = () => {
        if (votedCandidate) {
            // Salvar o candidato votado no localStorage para persistir entre páginas
            localStorage.setItem('votedCandidate', JSON.stringify(votedCandidate));
            navigate('/dashboard');
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
                    />
                </div>

                {votedCandidate && (
                    <div className="contentSubtitle">
                        <p>Verifique se o nome e rosto se encaixam com o do seu candidato.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
