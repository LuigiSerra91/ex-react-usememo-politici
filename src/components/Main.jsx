import { useEffect, useState, useMemo, memo } from "react";


const CardPolitician = memo(({ card }) => {
    console.log(`Rendering card: ${card.name}`);

    return (
        <div className="col-md-3 col-sm-6">
            <div className="card shadow-sm h-100">
                <img src={card.image} className="card-img-top" alt={card.name} />
                <div className="card-body">
                    <h5 className="card-title">{card.name}</h5>
                    <p className="card-subtitle text-muted pb-2">Posizione: {card.position}</p>
                    <p className="card-text"><strong>Biografia:</strong> {card.biography}</p>
                </div>
            </div>
        </div>
    );
});

export default function Main() {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Errore nel recupero dati:", error);
            setError(error.message);
            return [];
        }
    }

    useEffect(() => {
        async function fetchDataAndSetState() {
            const politicalData = await fetchData("https://boolean-spec-frontend.vercel.app/freetestapi/politicians");
            if (Array.isArray(politicalData)) {
                setCards(politicalData);
            } else {
                setError("Dati ricevuti non validi");
            }
        }
        fetchDataAndSetState();
    }, []);


    const filteredCards = useMemo(() => {
        return cards.filter(card =>
            card.name.toLowerCase().includes(search.toLowerCase()) ||
            card.biography.toLowerCase().includes(search.toLowerCase())
        );
    }, [cards, search]);

    return (
        <div className="container mt-4">
            <h1 className="text-center p-2">Lista Completa dei Politici</h1>


            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Cerca per nome o biografia..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {error ? (
                <p className="text-danger text-center">⚠️ Errore nel caricamento: {error}</p>
            ) : filteredCards.length > 0 ? (
                <div className="row g-3">
                    {filteredCards.map((card) => (
                        <CardPolitician key={card.id} card={card} />
                    ))}
                </div>
            ) : (
                <p className="text-center">❌ Nessun risultato trovato.</p>
            )}
        </div>
    );
}
