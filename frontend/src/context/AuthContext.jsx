import { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider =({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Runs once when the app first loads. Asks the backend "who am I,
    // based on my cookie" — this is what survives a page refresh.
    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
                if (!res.ok) { 
                    setUser(null);
                    return; // stop here — don't fall through to res.json()
                 }
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
    }
    checkSession();
    }, []);

   async function login(username, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            const errData = await res.json();
            if (Array.isArray(errData.errors)) {
                const messages = errData.errors.map(e => e.msg).join(',');
                throw new Error(messages);
            }
            throw new Error(errData.error || 'Login failed');
        }
        const data = await res.json();
        setUser(data.user);
    }

    async function register(username, email, password) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, email, password }),
        });
        if (!res.ok) {
            const errData = await res.json();
            if (Array.isArray(errData.errors)) {
                const messages = errData.errors.map(e => e.msg).join(', ');
                throw new Error(messages);
            }
            throw new Error(errData.error || 'Registration failed');
        }
        const data = await res.json();
        setUser(data.user);
    }

    async function logout() {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;