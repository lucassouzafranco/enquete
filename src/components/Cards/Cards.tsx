import React from "react";
import "./Cards.css";
import romario from "../../assets/romario.jpg";
import damaso from "../../assets/damaso.jpg";
import pastormirim from "../../assets/pastormirim.jpeg";
import tiririca from "../../assets/tiririca.jpeg";
import manga from "../../assets/manga.png";

export default function Cards({ votedCandidate, setVotedCandidate, onConfirmVote }) {
    const candidates = [
        { id: 1, name: "Romário", img: romario },
        { id: 2, name: "Prefeito de Sorocaba", img: manga },
        { id: 3, name: "Pastor Mirim", img: pastormirim },
        { id: 4, name: "Pedro Damaso", img: damaso },
        { id: 5, name: "Tiririca", img: tiririca },
    ];

    const handleVote = (id) => {
        const selected = candidates.find((c) => c.id === id);
        if (selected) {
            setVotedCandidate(selected);
        }
    };

    const clearVote = () => {
        setVotedCandidate(null);
    };

    const handleConfirmClick = () => {
        if (onConfirmVote) {
            onConfirmVote();
        }
    };

    let orderedCandidates = [...candidates];
    if (votedCandidate) {
        const voted = orderedCandidates.find((c) => c.id === votedCandidate.id);
        if (voted) {
            const others = orderedCandidates.filter((c) => c.id !== votedCandidate.id);
            const leftSide = others.slice(0, 2);
            const rightSide = others.slice(2, 4);
            orderedCandidates = [...leftSide, voted, ...rightSide];
        }
    }

    return (
        <div className="cardsRoot">
            {votedCandidate && <div className="overlay" onClick={clearVote} />}
            
            <div className="cardsWrapper">
                {orderedCandidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className={`card 
                            ${votedCandidate && votedCandidate.id !== candidate.id ? "faded" : ""} 
                            ${votedCandidate && votedCandidate.id === candidate.id ? "selectedCard" : ""}
                        `}
                    >
                        <img
                            src={candidate.img}
                            alt={`${candidate.name} image`}
                            className="avatarImage"
                        />
                        <span className="profileName">{candidate.name}</span>
                        <button
                            className="voteButton"
                            onClick={() => {
                                if (votedCandidate?.id === candidate.id) {
                                    handleConfirmClick();
                                } else {
                                    handleVote(candidate.id);
                                }
                            }}
                        >
                            <p>
                                {votedCandidate?.id === candidate.id
                                    ? "Confirmo"
                                    : "votar"}
                            </p>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
