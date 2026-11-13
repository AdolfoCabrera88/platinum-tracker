import { Link } from 'react-router-dom';

const JournalEntry = ({ entry, onEdit }) => {
    return (
        <div className="journal-entry">
            <img src={entry.game.cover_url} alt={`${entry.game.title} cover`} className="journal-entry-cover" />
            <div className="journal-entry-body">                
                <h2 className="journal-entry-title">
                    <Link 
                        to={`/games/${entry.game_id}`} 
                        className="journal-entry-link"
                    >
                        {entry.game.title}
                    </Link>
                </h2>
                
                <div className="journal-entry-meta">
                    <p>{new Date(entry.platinum_date).toLocaleDateString("en-US",
                        { 
                            timeZone: "UTC",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                    </p>

                    {entry.hours_spent != null && (
                    <p>Hours: {entry.hours_spent}</p>
                    )}

                    {entry.personal_difficulty != null && (
                    <p>Difficulty: {`${entry.personal_difficulty} / 10`}</p>
                    )}
                    
                    {entry.notes && 
                        <p className="journal-entry-notes">Notes: {entry.notes}</p>
                    }
                </div>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onEdit}
                >
                    Edit
                </button>
            </div>
        </div>
    )
}

export default JournalEntry;