import React from "react";
import "./Cards.css";
import avatar1 from "../../assets/avatar john doe.png";
import avatar2 from "../../assets/avatar marry jane.png";
import avatar3 from "../../assets/avatar dr auzio.png";

export default function Cards({ votedCandidate, setVotedCandidate }) {
    const candidates = [
        { id: 1, name: "John Doe", img: avatar1 },
        { id: 2, name: "Marry Jane", img: avatar2 },
        { id: 3, name: "Dr. Auzio", img: avatar3 },
    ];

    const handleVote = (id) => {
        const selected = candidates.find((c) => c.id === id);
        setVotedCandidate(selected);
    };

    const clearVote = () => {
        setVotedCandidate(null);
    };

    let orderedCandidates = [...candidates];
    if (votedCandidate) {
        const voted = orderedCandidates.find((c) => c.id === votedCandidate.id);
        const others = orderedCandidates.filter((c) => c.id !== votedCandidate.id);
        orderedCandidates = [others[0], voted, others[1]];
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
                            onClick={() => handleVote(candidate.id)}
                        >
                            <p>
                                {votedCandidate?.id === candidate.id
                                    ? "Confirmo meu voto"
                                    : "votar"}
                            </p>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
