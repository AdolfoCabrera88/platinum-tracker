export default function ProgressBar({ earned = 0 , total }) {

const percent = Math.min(100, Math.round( total > 0 ? (earned / total) * 100 : 0));

return (
    <div className="progress">
        <p>{`${earned}/${total} (${percent}%)`}</p>
        <div 
            role="progressbar" 
            aria-valuenow={percent} 
            aria-valuemin={0} 
            aria-valuemax={100} 
            className="progress-bar"  
        >
            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
    </div>
    );
}