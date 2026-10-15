import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
      const { register } = useAuth();
      const navigate = useNavigate();
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [email, setEmail] = useState('');
      const [error, setError] = useState(null);
 
  async function handleSubmit(e) {
        e.preventDefault(); // stops the browser's default full-page-reload form submit
        setError(null);
        try {
            await register(username, email, password); 
            navigate('/games');
        } catch (err) {
            setError(err.message);
        }
    }


    return (
         <main className="register-page">

            <section className="section">

            <div className="card form-card">

                <div className="section-header">
                <h1 className="section-title">
                    Create Account
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
                    placeholder="Choose a username"
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
                    htmlFor="email"
                    className="form-label"
                    >
                    Email
                    </label>

                    <input
                    className="form-input"
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
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
                    placeholder="Create a password"
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
                    Register
                </button>

                <p>
                    Already have an account?{' '}
                    <Link to="/login" className="section-link">
                        Log in
                    </Link>
                </p>

                </form>

            </div>

            </section>

        </main>
    );
}

export default RegisterPage;