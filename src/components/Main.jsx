import { useEffect, useState } from "react";

export default function Main() {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Dati ricevuti:", data); // Debug per verificare i dati ricevuti
            return data;
        } catch (error) {
            console.error("Errore nel recupero dati:", error);
            setError(error.message);
            return []; // Per evitare crash su `map()`
        }
    }

    useEffect(() => {
        async function fetchDataAndSetState() {
            const politicalData = await fetchData("https://boolean-spec-frontend.vercel.app/freetestapi/politicians");
            if (Array.isArray(politicalData)) {
                setCards(politicalData);
            } else {
                console.error("Dati non validi:", politicalData);
                setError("Dati ricevuti non validi");
            }
        }

        fetchDataAndSetState();
    }, []);

    return (
        <div className="container">
            {error ? (
                <p style={{ color: "red" }}>⚠️ Errore nel caricamento: {error}</p>
            ) : cards.length > 0 ? (
                <div className="card">
                    {cards.map((card) => (
                        <div key={card.id} className="cardInformation">
                            <p>{card.name}</p>
                            <img src={card.image} alt={card.name} />
                            <p>{card.position}</p>
                            <p>{card.biography}</p> {/* Corretto da "biografy" a "biography" */}
                        </div>
                    ))}
                </div>
            ) : (
                <p>⏳ Caricamento...</p>
            )}
        </div>
    );
}
