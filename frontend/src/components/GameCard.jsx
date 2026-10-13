import { Link } from 'react-router-dom';
import '../styles/App.css';

const GameCard = ({ game }) => {

  return (
  <div className="game-card">
    <img src={game.cover_url} alt={`${game.title} cover`} className="game-cover" />
    <div className="game-info">
      <h2>{game.title}</h2>
      <p>{game.game_description}</p>

      <Link to={`/games/${game.id}`}>View Details</Link>
  </div>
</div>
  );
};

export default GameCard;