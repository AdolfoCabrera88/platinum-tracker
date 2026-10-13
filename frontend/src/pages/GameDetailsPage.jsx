import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_URL } from '../config';
import '../styles/gameDetailsPage.css';

const GameDetailsPage = () => {
    let { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusErr, setStatusErr] = useState(null);
    const [platinumErr, setPlatinumErr] = useState(null);
    const [platinumForm, setPlatinumForm] = useState({ hours_spent: '', personal_difficulty: '', notes: '' });

    const allEarned = game && game.trophies.every(t => t.earned) && game.trophies.length !== 0;

    useEffect(() => {
        async function fetchGame() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/games/${id}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setGame(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchGame();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!newStatus) return; // ignore reselecting the placeholder
        if(!user) {
            navigate('/login');
            return;
        }
        try {
        const response = await fetch(`${API_URL}/games/${id}/library`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                status: newStatus 
            })
        });
        if(!response.ok) {
            setStatusErr('Failed to update status');
            return;
        }
        setGame(prev => ({
            ...prev,
            userStatus: newStatus
        }));
        setStatusErr(null); // clear any previous error
        } catch (err) {
            setStatusErr('Could not reach server');
        }
    }

    const handleTrophyChange = async (trophy) => {
    if (!user) {
        navigate('/login');
        return;
    }
    try {
        const response = await fetch(`${API_URL}/trophies/${trophy.id}/progress`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ earned: !trophy.earned })
        });
        if (!response.ok) {
            setStatusErr('Failed to update trophy');
            return;
        }
        setGame(prev => ({
            ...prev,
            trophies: prev.trophies.map(t =>
                t.id === trophy.id ? { ...t, earned: !t.earned } : t
            )
        }));
        setStatusErr(null);
        } catch (err) {
            setStatusErr('Could not reach server');
        }
    }

    const handlePlatinumSubmit = async (e) => {
        e.preventDefault();
        setPlatinumErr(null);
        try {
            const response = await fetch(`${API_URL}/games/${id}/platinum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    hours_spent: Number(platinumForm.hours_spent),
                    personal_difficulty: Number(platinumForm.personal_difficulty),
                    notes: platinumForm.notes
                })
            });
            if (!response.ok) {
            if (response.status === 409) {
                setPlatinumErr('Platinum already recorded for this game.');
            } else {
                setPlatinumErr('Failed to create platinum record.');
            }
            return;
        }
        setGame(prev => ({...prev,userStatus: 'PLATINUM'}));
            } catch (err) {
                setPlatinumErr('Could not reach server');
            }
    }


    if (loading) return <p>Loading game details...</p>;
    if (error) return <p>Error loading game details: {error}</p>;

    return (
        <div>
                    <h1>Game Details Page</h1>
                    {game && (
                        <div key={game.id} className="game-details-page--card">
                            <img src={game.cover_url} alt={`${game.title} cover`} className="game-details-page--cover" />
                            <div className="game-details-page--info">
                                <h2>{game.title}</h2>
                                <p>{game.game_description}</p>
                                <p>Platform: {game.platforms.join(', ')}</p>
                                <p>Release Date: {game.release_date}</p>
                                <p>Trophies: {game.trophies.length}</p>

                                <label htmlFor="status-select">Status: </label>
                                <select 
                                id="status-select"
                                disabled={game.userStatus === 'PLATINUM'}
                                value={game.userStatus || ''}
                                onChange={ (e) => handleStatusChange( e.target.value)}>
                                    <option value="">Select status</option>
                                    <option value="WANT_TO_PLAY">Want to Play</option>
                                    <option value="PLAYING">Playing</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                                {statusErr && <p className="error">{statusErr}</p>}


                                <div>
                                    <h3>Trophies</h3>
                                    {!game.userStatus && <p>Add this game to your library to track trophies.</p>}
                                    {game.trophies.map((trophy) => (
                                        <div key={trophy.id}>
                                            <p>{trophy.name}</p>
                                            <input 
                                            type="checkbox" 
                                            checked={trophy.earned ? true : false} 
                                            disabled={!game.userStatus || game.userStatus === 'PLATINUM'}
                                            onChange={() => handleTrophyChange(trophy)}
                                        />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3>Platinum</h3>
                                    {!allEarned && game.userStatus !== 'PLATINUM' && <p>Earn all trophies to unlock platinum.</p>}
                                    {allEarned && game.userStatus !== 'PLATINUM' && (
                                    <form onSubmit={handlePlatinumSubmit}>
                                        <input //hours spent input for platinum
                                             type="number"
                                             name="hours_spent"
                                             min="0"
                                             placeholder="Hours spent"
                                             value={platinumForm.hours_spent}
                                             onChange={(e) => setPlatinumForm( prev => ({...prev, hours_spent: e.target.value}))}
                                             required
                                        />
                                        <input //personal difficulty input for platinum
                                             type="number"
                                             name="personal_difficulty"
                                             min="1"
                                             max="10"
                                             placeholder="Difficulty"
                                             value={platinumForm.personal_difficulty}
                                             onChange={(e) => setPlatinumForm(prev => ({...prev, personal_difficulty: e.target.value}))}
                                             required
                                        />
                                        <textarea //notes input for platinum
                                             name="notes"
                                             value={platinumForm.notes}
                                             placeholder="Notes"
                                             onChange={(e) => setPlatinumForm(prev => ({...prev, notes: e.target.value}))}
                                        />
                                        {platinumErr && <p className="error">{platinumErr}</p>}
                                        <button type="submit">Create Platinum</button>
                                    </form>
                                    )}
                                    {game.userStatus === 'PLATINUM' && <p>Platinum trophy earned!</p>}
                                </div>
                            </div>
                        </div>
                    )}   
        </div>
    )
}

export default GameDetailsPage;