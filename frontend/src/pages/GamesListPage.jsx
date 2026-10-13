import GameCard from '../components/GameCard';
import NavBar from '../components/Navbar.jsx';
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

        const response = await fetch(`${API_URL}/games`);
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
    <>
      <div className="games-list-page">
           <NavBar />
        <div className="games-grid">
          {games.length === 0 ? (
            <p>No games available.</p>
          ) : (
            games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </div>
      </div>
    </>
  )
};

export default GamesListPage;