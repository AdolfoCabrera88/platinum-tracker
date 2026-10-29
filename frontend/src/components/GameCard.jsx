import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import '../styles/App.css';

const GameCard = ({ game }) => {

  return (

    <article className="game-card">

      <div className="game-card-image-container">
        <img
          src={game.cover_url}
          alt={`${game.title} cover`}
          className="game-card-image"
        />
      </div>

      <div className="game-card-content">

        <h2 className="game-card-title">
          {game.title}
        </h2>

        <p className="game-card-meta">
          {new Date(game.release_date).toLocaleDateString('en-US', { timezone: "UTC", year: 'numeric' })}
        </p>

        <ProgressBar
          earned={game.earnedTrophies} 
          total={game.totalTrophies}
        />

        <Link
          to={`/games/${game.id}`}
          className="btn-secondary"
        >
          View Details
        </Link>

      </div>

    </article>
  );
};

export default GameCard;