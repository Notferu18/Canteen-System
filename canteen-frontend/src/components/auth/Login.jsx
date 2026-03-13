import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Client-side validation
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const userData = await login(email, password);
            
            if (userData) {
                const userRole = userData.role?.toLowerCase() || '';

                // Role-based navigation
                const routes = {
                    'admin': '/dashboard',
                    'cashier': '/pos',
                    'default': '/menu'
                };

                navigate(routes[userRole] || routes['default']);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">🍽️</div>
                    <h1>Canteen Login</h1>
                    <p>Enter your account details</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            autoComplete="email"
                            required
                            disabled={loading}
                            className={error && !email ? 'input-error' : ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                autoComplete="current-password"
                                required
                                disabled={loading}
                                className={error && !password ? 'input-error' : ''}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn" 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Authenticating...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <p className="register-link">
                        Don't have an account?{' '}
                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;