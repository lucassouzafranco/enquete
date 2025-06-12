import React from "react";
import "./Content.css";
import Cards from "../Cards/Cards";

export default function Content() {
    return(
        <div className="contentBackground">
            <div className="contentContainer">
                <div className="contentTitle">
                    <p>Escolha o seu candidato(a) favorito(a)</p>
                </div>
                <div className="content">
                    <Cards />
                </div>
            </div>
        </div>
    )
}