
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../src/contexts';
import McmLogo from '../components/McmLogo';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password') {
            setError('');
            login();
            navigate('/dashboard');
        } else {
            setError('Invalid username or password. Use admin/password.');
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-dark-background flex flex-col justify-center items-center px-4">
            <div className="text-center mb-8">
                <McmLogo className="h-16 w-16 text-primary dark:text-dark-primary mx-auto" />
                <h1 className="text-4xl font-bold text-primary dark:text-dark-primary mt-4">MCM Alerts</h1>
                <p className="text-secondary dark:text-dark-secondary">Sign in to access your dashboard</p>
            </div>
            <div className="w-full max-w-md bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md border border-border dark:border-dark-border">
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-secondary dark:text-dark-secondary text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow-sm appearance-none border dark:border-dark-border bg-surface dark:bg-dark-background rounded-lg w-full py-3 px-4 text-primary dark:text-dark-primary leading-tight focus:outline-none focus:ring-2 focus:ring-mcm-accent"
                            id="username"
                            type="text"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-secondary dark:text-dark-secondary text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow-sm appearance-none border dark:border-dark-border bg-surface dark:bg-dark-background rounded-lg w-full py-3 px-4 text-primary dark:text-dark-primary mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-mcm-accent"
                            id="password"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-primary w-full text-action-text-light dark:text-action-text-dark dark:bg-mcm-accent font-bold py-3 px-4 rounded-lg hover:bg-secondary dark:hover:bg-mcm-accent-light focus:outline-none focus:shadow-outline transition-colors"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
