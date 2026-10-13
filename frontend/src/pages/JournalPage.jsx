import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const JournalPage = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diaryEntries, setDiaryEntries] = useState([]);

    useEffect(() => {
        const fetchDiaryEntries = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/profile/journal`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch diary entries');
                }
                const data = await response.json();
                setDiaryEntries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDiaryEntries();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Journal Page</h1>
            {diaryEntries.length === 0 ? (
                <p>No Journal entries found.</p>
            ) : (
                <ul>
                    {diaryEntries.map((entry) => (
                    <li key={entry.id}>
                        <Link to={`/games/${entry.game_id}`}>
                        {entry.game.title}
                        </Link>

                        <p>{new Date(entry.platinum_date).toLocaleDateString()}</p>
                        <p>Hours: {entry.hours_spent ?? 'N/A'}</p>
                        <p>Difficulty: {entry.personal_difficulty ?? 'N/A'}</p>
                        <p>Notes: {entry.notes ?? 'N/A'}</p>
                    </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default JournalPage;