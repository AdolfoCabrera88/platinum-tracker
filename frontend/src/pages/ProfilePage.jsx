import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'
import { API_URL } from '../config';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${API_URL}/profile/stats`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profileData) {
        return null;
    }

    return (
        <main>
            <section className="section">
                <header className="section-header">
                    <h1 className="section-title">Profile</h1>
                </header>
                
                {profileData.totalPlatinum === 0 && (
                    <div>
                        <p className="empty-state">No Platinum trophies yet.</p>
                        <Link to="/games" className="btn-secondary">
                            Browse Games
                        </Link>
                    </div>
                )}

                <div className="stats-grid">

                    <div className="stat-card">
                        <span className="stat-label">Total Platinum</span>
                        <span className="stat-number">{profileData.totalPlatinum}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Hardest Platinum (difficulty)</span>
                        <span className="stat-number">{profileData.hardestPlatinum ? profileData.hardestPlatinum.difficulty : 'N/A'}</span>
                        {profileData.hardestPlatinum?.game && (
                            <small className="stat-detail">{profileData.hardestPlatinum.game}</small>
                        )}
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Easiest Platinum (difficulty)</span>
                        <span className="stat-number">{profileData.easiestPlatinum ? profileData.easiestPlatinum.difficulty : 'N/A'}</span>
                        {profileData.easiestPlatinum?.game && (
                            <small className="stat-detail">{profileData.easiestPlatinum.game}</small>
                        )}
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Total Games</span>
                        <span className="stat-number">{profileData.totalGames}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Longest Platinum Hours</span>
                        <span className="stat-number">{profileData.longestPlatinumHours?.hours ?? 'N/A'}</span>
                        {profileData.longestPlatinumHours?.game && (
                            <small className="stat-detail">{profileData.longestPlatinumHours.game}</small>
                        )}
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Shortest Platinum Hours</span>
                        <span className="stat-number">{profileData.shortestPlatinumHours?.hours ?? 'N/A'}</span>
                        {profileData.shortestPlatinumHours?.game && (
                            <small className="stat-detail">{profileData.shortestPlatinumHours.game}</small>
                        )}
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Average Difficulty</span>
                        <span className="stat-number">{profileData.avgDifficulty?.toFixed(1) ?? 'N/A'}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Average Hours</span>
                        <span className="stat-number">{profileData.avgHours?.toFixed(1) ?? 'N/A'}</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Total Trophies Earned</span>
                        <span className="stat-number">{profileData.totalTrophiesEarned}</span>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ProfilePage;