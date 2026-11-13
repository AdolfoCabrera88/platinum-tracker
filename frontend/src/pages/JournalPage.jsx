import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import JournalEntry from '../components/JournalEntry';
import PlatinumForm from '../components/PlatinumForm';

const JournalPage = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [journalEntries, setJournalEntries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editErr, setEditErr] = useState(null);

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

    const handleEdit = async (entry, values) => {
        setEditErr(null);

        try {
            const response = await fetch(
                `${API_URL}/games/${entry.game_id}/platinum`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(values)
                }
            );

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                setEditErr(
                    result.error || 'Failed to update platinum record.'
                );
                return;
            }

            setJournalEntries(prev =>
                prev.map(e =>
                    e.id === entry.id
                        ? { ...e, ...result.data }
                        : e
                )
            );

            setEditingId(null);

        } catch (err) {
            setEditErr('Could not reach server');
        }
    };

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
                            editingId === entry.id ? (
                                <PlatinumForm
                                    key={entry.id}
                                    initialValues={{
                                        hours_spent: String(entry.hours_spent ?? ''),
                                        personal_difficulty: String(entry.personal_difficulty ?? ''),
                                        notes: entry.notes ?? ''
                                    }}
                                    onSubmit={(values) => handleEdit(entry, values)}
                                    submitLabel="Save changes"
                                    error={editErr}
                                    onCancel={() => {
                                        setEditingId(null);
                                        setEditErr(null);
                                    }}
                                />
                            ) : (
                                <JournalEntry
                                    key={entry.id}
                                    entry={entry}
                                    onEdit={() => {
                                        setEditErr(null);
                                        setEditingId(entry.id);
                                    }}
                                />
                            )
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default JournalPage;