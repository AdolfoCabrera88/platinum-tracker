import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navBar">
            <div className ="app-container">
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/games">Games</Link>
                </div>
                <h1>Platinum Tracker</h1>
                <div>
                    {user ? (
                        <div>
                            <span>Welcome, {user.username}</span>
                            <button onClick={logout}>Logout</button>
                            <Link to="/profile/profile">Profile</Link>
                            <Link to="/profile/journal">Journal</Link>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;