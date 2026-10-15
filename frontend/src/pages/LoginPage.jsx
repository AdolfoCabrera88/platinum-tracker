import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
      const { login } = useAuth();
      const navigate = useNavigate();
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState(null);
 
  async function handleSubmit(e) {
        e.preventDefault(); // stops the browser's default full-page-reload form submit
        setError(null);
        try {
            await login(username, password);
            navigate('/games');
        } catch (err) {
            setError(err.message);
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
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                    />

                </div>


                {error && (
                    <p className="error">
                    {error}
                    </p>
                )}


                <button
                    type="submit"
                    className="btn-primary"
                >
                    Login
                </button>

                <p>
                    Don't have an account?{' '}
                    <Link to="/register" className="section-link">
                        Register
                    </Link>
                </p>

                </form>

            </div>

            </section>

        </main>

    );
}

export default LoginPage;