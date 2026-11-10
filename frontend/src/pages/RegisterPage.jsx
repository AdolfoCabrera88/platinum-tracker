import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const location = useLocation();
    const from = location.state?.from || '/games';

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        setSubmitting(true);
        try {
            await register(username, email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setErrors(Array.isArray(err.messages) ? err.messages : [err.message]);
        } finally {
            setSubmitting(false);
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
                    autoComplete="username"
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                    />

                    <p className="form-hint">
                        3 to 20 characters: letters, numbers and underscores.
                    </p>
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
                    autoComplete="email"
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
                    autoComplete="new-password"
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                    />

                     {/* if rules change in index.js update new rules*/}
                       <p className="form-hint">
                       At least 8 characters, with an uppercase letter, a lowercase letter, a number and one of @$!%*?&.
                    </p>
                    
                </div>


                {errors.length > 0 && (
                    <div className="error" role="alert">
                        {errors.map((message) => (
                            <p key={message}>{message}</p>
                        ))}
                    </div>
                )}


                <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                >
                    Register
                </button>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" className="section-link" state={location.state}>
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