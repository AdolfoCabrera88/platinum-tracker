import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import JournalEntry from '../components/JournalEntry';

const JournalPage = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [journalEntries, setJournalEntries] = useState([]);

    useEffect(() => {
        const fetchJournalEntries = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/profile/journal`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch journal entries');
                }
                const data = await response.json();
                setJournalEntries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJournalEntries();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main>
            <section className="section">
                <header className="section-header">
                    <h1 className="section-title">Journal</h1>
                </header>
                {journalEntries.length === 0 ? (
                    <div>
                        <p className="empty-state">No Platinum trophies yet.</p>
                        <Link to="/games" className="btn-secondary">
                            Browse Games
                        </Link>
                    </div>
                ) : (

                    <div className="journal-list">
                        {journalEntries.map((entry) => (
                            <JournalEntry key={entry.id} entry={entry} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default JournalPage;