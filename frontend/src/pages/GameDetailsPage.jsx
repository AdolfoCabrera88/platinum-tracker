import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_URL } from '../config';
import TrophyItem from '../components/TrophyItem.jsx';
import ProgressBar from '../components/ProgressBar.jsx'
import PlatinumForm from '../components/PlatinumForm.jsx';

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
    const location = useLocation();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusErr, setStatusErr] = useState(null);
    const [platinumErr, setPlatinumErr] = useState(null);

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
            navigate('/login', { state: { from: location.pathname } })
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

    const handlePlatinumSubmit = async (values) => {
        setPlatinumErr(null);

        try {
            const response = await fetch(`${API_URL}/games/${id}/platinum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));

                setPlatinumErr(
                    errData.error || 'Failed to create platinum record.'
                );

                return;
            }

            setGame(prev => ({
                ...prev,
                userStatus: 'PLATINUM'
            }));

        } catch (err) {
            setPlatinumErr('Could not reach server');
        }
    };


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
                        {new Date(game.release_date).toLocaleDateString("en-US", { timeZone: "UTC"})}
                        </span>
                    </div>

                    </div>


                    {/* STATUS */}

                    <div className="form-group">

                    {!game.userStatus ? (
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleStatusChange('PLAYING')}
                        >
                            Add to library
                        </button>
                    ) : game.userStatus === "PLATINUM" ? (
                        <p className="status-badge">🏆 Platinum</p>
                        ) : (
                        <>
                            <label htmlFor="status-select" className="form-label" > Game Status </label>

                            <select
                                id="status-select"
                                className="form-select"
                                value={game.userStatus}
                                onChange={(e) =>
                                handleStatusChange(e.target.value)
                                }
                            >
                                <option value="WANT_TO_PLAY">
                                Want to Play
                                </option>

                                <option value="PLAYING">
                                Playing
                                </option>

                                <option value="COMPLETED">
                                Completed
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
                            <h3><span className={`trophy-group-title trophy-group-title--${grade}`}>{grade}</span> {earnedInGroup}/{group.length}</h3>

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
                    <p className="hint">
                        Earn all trophies to unlock the platinum.
                    </p>
                    )}


                {allEarned &&
                    game.userStatus !== "PLATINUM" && (

                    <PlatinumForm 
                        initialValues={{
                            hours_spent: '',
                            personal_difficulty: '',
                            notes: ''
                        }}
                        onSubmit={handlePlatinumSubmit}
                        submitLabel="Create Platinum"
                        error={platinumErr}
                    />
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