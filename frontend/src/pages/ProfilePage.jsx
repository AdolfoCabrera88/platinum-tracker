import {useState, useEffect} from 'react';
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
        <div>
            <h1>Profile Page</h1>
            <p>Total Platinum: {profileData.totalPlatinum}</p>
            <p>Average Difficulty: {profileData.avgDifficulty.toFixed(1)}</p>
            <p>Average Hours: {profileData.avgHours.toFixed(1)}</p>
            <p>Longest Platinum Hours: {profileData.longestPlatinumHours ?? 'N/A'}</p>
            <p>Shortest Platinum Hours: {profileData.shortestPlatinumHours ?? 'N/A'}</p>
            <p>Hardest Platinum: {profileData.hardestPlatinum ? `${profileData.hardestPlatinum.game} (${profileData.hardestPlatinum.difficulty}/10)` : 'None yet'}</p>
            <p>Easiest Platinum: {profileData.easiestPlatinum ? `${profileData.easiestPlatinum.game} (${profileData.easiestPlatinum.difficulty}/10)` : 'None yet'}</p>
            <p>Total Games: {profileData.totalGames}</p>
            <p>Total Trophies Earned: {profileData.totalTrophiesEarned}</p>
        </div>
    );
}

export default ProfilePage;