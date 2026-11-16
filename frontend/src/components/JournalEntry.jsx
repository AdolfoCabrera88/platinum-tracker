import { Link } from 'react-router-dom';
import { useState } from 'react';

const JournalEntry = ({ entry, onEdit, onDelete }) => {

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await onDelete();
        } finally {
            setDeleting(false);
            setConfirmingDelete(false);
        }
    };

    return (
        <div className="journal-entry">
            <img
                src={entry.game.cover_url}
                alt={`${entry.game.title} cover`}
                className="journal-entry-cover"
            />
            <div className="journal-entry-body">
                <h2 className="journal-entry-title">
                    <Link to={`/games/${entry.game_id}`} className="journal-entry-link">
                        {entry.game.title}
                    </Link>
                </h2>

                <div className="journal-entry-meta">
                    <p>
                        {new Date(entry.platinum_date).toLocaleDateString('en-US', {
                            timeZone: 'UTC',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>

                    {entry.hours_spent != null && <p>Hours: {entry.hours_spent}</p>}

                    {entry.personal_difficulty != null && (
                        <p>Difficulty: {entry.personal_difficulty} / 10</p>
                    )}

                    {entry.notes && (
                        <p className="journal-entry-notes">Notes: {entry.notes}</p>
                    )}
                </div>

                <div className="journal-entry-actions">
                    {confirmingDelete ? (
                        <>
                            <p className="journal-entry-confirm" role="alert">
                                Remove this Platinum? Your other trophies stay ticked.
                            </p>
                            <button
                                type="button"
                                className="btn-danger"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Removing...' : 'Yes, remove'}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setConfirmingDelete(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={onEdit}
                                aria-label={`Edit ${entry.game.title}`}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setConfirmingDelete(true)}
                                aria-label={`Remove ${entry.game.title} Platinum`}
                            >
                                Remove
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalEntry;