import React from "react";
import "./Cards.css";

export default function Cards({ votedCandidate, setVotedCandidate, onConfirmVote }) {
    const candidates = [
        { id: 1, name: "Bulbasauro", img: "https://projectpokemon.org/images/normal-sprite/bulbasaur.gif" },
        { id: 2, name: "Pikachu", img: "https://projectpokemon.org/images/normal-sprite/pikachu.gif" },
        { id: 3, name: "Charmander", img: "https://projectpokemon.org/images/normal-sprite/charmander.gif" },
        { id: 4, name: "Squirtle", img: "https://projectpokemon.org/images/normal-sprite/squirtle.gif" },
        { id: 5, name: "Eevee", img: "https://projectpokemon.org/images/normal-sprite/eevee.gif" },
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
                        <div className="avatarImageContainer">
                            <img
                                src={candidate.img}
                                alt={`${candidate.name} image`}
                                className="avatarImage"
                            />
                        </div>
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
