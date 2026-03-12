import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // Prevent form from refreshing the page
        if (e) e.preventDefault();
        
        if (loading) return;

        console.log("Login attempt started..."); 
        setLoading(true);

        try {
            const success = await login(email, password);
            
            if (success) {
                console.log("Login successful! Redirecting...");
                
                /**
                 * If navigate('/dashboard') isn't working, use this hard redirect.
                 * It forces the browser to reload the app with the new token
                 * stored in LocalStorage.
                 */
                window.location.href = '/dashboard'; 
            }
        } catch (error) {
            console.error("Login component error:", error);
        
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               "Invalid credentials or server is offline.";
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Canteen Login</h1>
                    <p>Enter your account details</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn" 
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;