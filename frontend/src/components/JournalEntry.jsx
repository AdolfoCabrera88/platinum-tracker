import { Link } from 'react-router-dom';

const JournalEntry = ({ entry }) => {
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
                    <p>Hours: {entry.hours_spent}</p>
                    <p>Difficulty: {`${entry.personal_difficulty} / 10`}</p>
                    {entry.notes && 
                        <p className="journal-entry-notes">Notes: {entry.notes}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default JournalEntry;