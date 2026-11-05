import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

        async function handleSubmit(e) {
            e.preventDefault();
            setErrors([]);
            setSubmitting(true);
            try {
                await login(username, password);
                navigate('/games');
            } catch (err) {
                setErrors([err.message]); // always an array, because the JSX calls .map on it
            } finally {
                setSubmitting(false);
            }
        }


    return (
        <main className="login-page">

            <section className="section">

                <div className="card form-card">

                    <div className="section-header">
                        <h1 className="section-title">
                            Welcome Back
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label
                        htmlFor="username"
                        className="form-label"
                        >
                        Username
                        </label>

                        <input
                        className="form-input"
                        type="text"
                        placeholder="Enter your username"
                        id="username"
                        value={username}
                        autoComplete="username"
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                            />

                    </div>


                    <div className="form-group">

                        <label
                            htmlFor="password"
                            className="form-label"
                        >
                            Password
                        </label>

                        <input
                        className="form-input"
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        />

                    </div>


                    {errors.length > 0 && (
                        <div className="error" role="alert">
                            {errors.map((message) => (
                                <p key={message}>{message}</p>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={submitting}>
                        Login
                    </button>

                    </form>

                    <p className="auth-switch">
                        Don't have an account?{' '}
                        <Link to="/register" className="section-link">Register</Link>
                    </p>

                </div>

            </section>

        </main>

    );
}

export default LoginPage;