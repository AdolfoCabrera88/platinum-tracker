import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_URL } from '../config';
import TrophyItem from '../components/TrophyItem.jsx';
import ProgressBar from '../components/ProgressBar.jsx'
import '../styles/app.css';

const trophyGrades = [
        "PLATINUM",
        "GOLD",
        "SILVER",
        "BRONZE"
    ]

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

    const [groupByTier, setGroupByTier] = useState(false)
    const trophiesLocked = !game?.userStatus || game?.userStatus === "PLATINUM"
    const earnedCount = game ? game.trophies.filter(t => t.earned).length : 0;

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
        <main className="game-detail">

            {game && (
            <>

                {/*  GAME HEADER */}

                <section className="game-detail-header">

                <img
                    src={game.cover_url}
                    alt={`${game.title} cover`}
                    className="game-detail-cover"
                />

                <div className="game-detail-info">

                    <h1 className="game-detail-title">
                    {game.title}
                    </h1>

                    <p className="game-detail-description">
                    {game.game_description}
                    </p>


                    {/* GAME STATS */}

                    <div className="game-detail-stats">

                    <div className="game-stat">
                        <span className="game-stat-label">
                        Trophies
                        </span>

                        <span className="game-stat-value">
                        {game.trophies.length}
                        </span>
                    </div>


                    <div className="game-stat">
                        <span className="game-stat-label">
                        Platform
                        </span>

                        <span className="game-stat-value">
                        {game.platforms.join(", ")}
                        </span>
                    </div>


                    <div className="game-stat">
                        <span className="game-stat-label">
                        Release Date
                        </span>

                        <span className="game-stat-value">
                        {new Date(game.release_date).toLocaleDateString("en-US", { timezone: "UTC:"})}
                        </span>
                    </div>

                    </div>


                    {/* STATUS */}

                    <div className="form-group">

                    {game.userStatus === "PLATINUM" ? (
                        <p className="status-badge">🏆 Platinum</p>
                        ) : (
                        <>
                            <label htmlFor="status-select" className="form-label" > Game Status </label>

                            <select
                                id="status-select"
                                className="form-select"
                                value={game.userStatus || ""}
                                onChange={(e) =>
                                handleStatusChange(e.target.value)
                                }
                            >
                                <option value="">
                                Select status
                                </option>

                                <option value="WANT_TO_PLAY">
                                Want to Play
                                </option>

                                <option value="PLAYING">
                                Playing
                                </option>

                                <option value="COMPLETED">
                                Completed
                                </option>

                                <option disabled hidden value="PLATINUM">
                                Platinum
                                </option>
                            </select>
                        </>
                    )}

                    {statusErr && (
                        <p className="error">
                        {statusErr}
                        </p>
                    )}

                    </div>

                </div>

                </section>


                {/* TROPHIES */}

                <section className="section">

                <div className="section-header">

                    <h2 className="section-title">
                    Trophies
                    </h2>

                    <div className="toggle-buttons">
                        <button type="button" className={`toggle-button ${!groupByTier ? 'active' : ''}`} aria-pressed={!groupByTier} onClick={() => setGroupByTier(false)}>
                            In-Game Order
                        </button>

                        <button type="button" className={`toggle-button ${groupByTier ? 'active' : ''}`} aria-pressed={groupByTier} onClick={() => setGroupByTier(true)}>
                            By Tier
                        </button>
                    </div>

                    {game.userStatus && (
                        <ProgressBar earned={earnedCount} total={game.trophies.length} />
                    )}
                </div>


                {!game.userStatus && (
                    <p className="hint">
                    Add this game to your library to track trophies.
                    </p>
                )}

                {groupByTier ? (
                    // group by tier
                    trophyGrades.map((grade) => {
                        const group = game.trophies.filter((trophy) => trophy.grade === grade);
                        if (group.length === 0) return null;
                        const earnedInGroup = group.filter((trophy) => trophy.earned).length;

                    return (
                        <div key={grade} className="trophy-group">
                            <h3>{grade} · {earnedInGroup}/{group.length}</h3>

                            <div className="trophy-list">
                        {group.map((trophy) => (

                            <TrophyItem 
                                key={trophy.id} 
                                trophy={trophy} 
                                disabled={trophiesLocked}
                                showGrade={!groupByTier} 
                                onToggle={handleTrophyChange} 
                            />

                        ))}
                            </div>
                        </div>
                        );
                    }) 
                ) : (
                    <div className="trophy-list">
                        {game.trophies.map((trophy) => (

                            <TrophyItem 
                                key={trophy.id} 
                                trophy={trophy} 
                                disabled={trophiesLocked}
                                showGrade={!groupByTier} 
                                onToggle={handleTrophyChange} 
                            />      
                        ))}
                    </div>
                )}
                </section>
                 

                {/* PLATINUM */}

                <section className="section">

                <div className="section-header">

                    <h2 className="section-title">
                    Rate Your Platinum
                    </h2>

                </div>


                {!allEarned &&
                    game.userStatus !== "PLATINUM" && (
                    <p className="game-card-meta">
                        Earn all trophies to unlock the platinum.
                    </p>
                    )}


                {allEarned &&
                    game.userStatus !== "PLATINUM" && (

                    <form
                        className="card form-card"
                        onSubmit={handlePlatinumSubmit}
                    >

                        <div className="form-group">

                        <label
                            htmlFor="hours-spent"
                            className="form-label"
                        >
                            Hours Spent
                        </label>

                        <input
                            id="hours-spent"
                            className="form-input"
                            type="number"
                            name="hours_spent"
                            min="1"
                            max="5000"
                            step="1"
                            placeholder="How many hours did it take?"
                            value={platinumForm.hours_spent}
                            onChange={(e) =>
                            setPlatinumForm((prev) => ({
                                ...prev,
                                hours_spent: e.target.value
                            }))
                            }
                            required
                        />

                        </div>


                        <div className="form-group">

                        <label
                            htmlFor="personal-difficulty"
                            className="form-label"
                        >
                            Personal Difficulty
                        </label>

                        <input
                            id="personal-difficulty"
                            className="form-input"
                            type="number"
                            name="personal_difficulty"
                            min="1"
                            max="10"
                            placeholder="Difficulty from 1–10"
                            value={platinumForm.personal_difficulty}
                            onChange={(e) =>
                            setPlatinumForm((prev) => ({
                                ...prev,
                                personal_difficulty: e.target.value
                            }))
                            }
                            required
                        />

                        </div>


                        <div className="form-group">

                        <label
                            htmlFor="platinum-notes"
                            className="form-label"
                        >
                            Notes
                        </label>

                        <textarea
                            id="platinum-notes"
                            className="form-textarea"
                            name="notes"
                            placeholder="Write about your platinum experience..."
                            value={platinumForm.notes}
                            onChange={(e) =>
                            setPlatinumForm((prev) => ({
                                ...prev,
                                notes: e.target.value
                            }))
                            }
                        />

                        </div>


                        {platinumErr && (
                        <p className="error">
                            {platinumErr}
                        </p>
                        )}


                        <button
                        type="submit"
                        className="btn-primary"
                        >
                        Create Platinum
                        </button>

                    </form>

                    )}


                {game.userStatus === "PLATINUM" && (

                    <div className="card card--platinum">

                    <div>
                        🏆
                    </div>

                    <h3>
                        Platinum Trophy Earned!
                    </h3>

                    <p className="hint">
                        You have completed every trophy for this game.
                    </p>

                    </div>

                )}

                </section>

            </>
            )}

        </main>
    );
}

export default GameDetailsPage;