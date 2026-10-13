import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="register-page">
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;