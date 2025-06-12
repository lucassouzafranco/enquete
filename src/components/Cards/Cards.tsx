import React from "react";
import "./Cards.css";
import avatar1 from "../../assets/avatar john doe.png";
import avatar2 from "../../assets/avatar marry jane.png";
import avatar3 from "../../assets/avatar dr auzio.png";


export default function Cards() {
    return (
        <>
            <div className="cardsContainer">
                <div className="card">
                    <img src={avatar1} alt="John Doe image" className="avatarImage" />
                    <span className="profileName">John Doe</span>
                    <button className="voteButton"><p>votar</p></button>
                </div>
            </div>

            <div className="cardsContainer">
                <div className="card">
                    <img src={avatar2} alt="Marry Jane image" className="avatarImage" />
                    <span className="profileName">Marry Jane</span>
                    <button className="voteButton"><p>votar</p></button>
                </div>
            </div>

            <div className="cardsContainer">
                <div className="card">
                    <img src={avatar3} alt="Dr. Auzio image" className="avatarImage" />
                    <span className="profileName">Dr. Auzio</span>
                    <button className="voteButton"><p>votar</p></button>
                </div>
            </div>
        </>
    );
}