import React, { useState } from "react";
import "./Content.css";
import Cards from "../Cards/Cards";

export default function Content() {
    const [votedCandidate, setVotedCandidate] = useState(null);

    const titleText = votedCandidate
        ? `Confirmação do Voto`
        : "Escolha o seu candidato(a) favorito(a)";

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
