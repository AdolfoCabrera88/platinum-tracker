import GameCard from '../components/GameCard';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../styles/App.css';

const GamesListPage = () => {
 
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/games`, {
            credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error loading games: {error}</p>;

  return (

    <main className="games-list-page">
      <section className="section">
        
        <div className="section-header">
          <h1 className="section-title">Games</h1>
        </div>

        {games.length === 0 ? (
          <p className="empty-state">No games available.</p>
        ) : (
          <div className="game-grid">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

      </section>
    </main>
  );

};

export default GamesListPage;