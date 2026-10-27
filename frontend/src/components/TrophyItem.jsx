const TrophyItem = ({ trophy, disabled, onToggle, showGrade }) => {

    return (
        <div className="trophy-item">
            <div className="trophy-item-icon">
                🏆
            </div>

            <div className="trophy-item-info">

                <p className="trophy-item-name">
                    {trophy.name}
                </p>

                {showGrade && ( 
                    <span className={`trophy-item-grade trophy-item-grade--${trophy.grade.toLowerCase()}`} >
                        {trophy.grade}
                    </span> )}

                <p className="trophy-item-description">
                    {trophy.description}
                </p>

            </div>

            <div className="trophy-item-action">

                <label>

                    <input
                        type="checkbox"
                        checked={trophy.earned ? true : false}
                        disabled={disabled}
                        onChange={() => onToggle(trophy)}
                    />

                <span className={trophy.earned ? "trophy-item-earned" : "trophy-item-unearned"}>
                    {trophy.earned
                    ? "Earned"
                    : "Not Earned"}
                </span>

                </label>
            </div>
        </div>
    );
};
export default TrophyItem;