import { useAuth } from '../context/AuthContext.jsx';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
    const { user, logout } = useAuth();

     return (
        <nav className="navbar">
            {/* LEFT: the brand */}
            <Link to="/" className="navbar-logo">
                Platinum Tracker
            </Link>

            {/* MIDDLE: where you can go */}
            <div className="navbar-links">
                <NavLink to="/" end className="navbar-link">Home</NavLink>
                <NavLink to="/games" className="navbar-link">Games</NavLink>
                {user && (
                    <>
                        <NavLink to="/profile" className="navbar-link">Profile</NavLink>
                        <NavLink to="/journal" className="navbar-link">Journal</NavLink>
                    </>
                )}
            </div>

            {/* RIGHT: you and your session */}
            <div className="navbar-actions">
                {user ? (
                    <>
                        <span className="navbar-user">Welcome, {user.username}</span>
                        <button className="btn-secondary" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="navbar-link">Login</NavLink>
                        <NavLink to="/register" className="navbar-link">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;