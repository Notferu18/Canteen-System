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
        if (e) e.preventDefault();
        setLoading(true);

        try {
            const userData = await login(email, password); 

            console.log("Full userData:", JSON.stringify(userData)); 
            
            if (userData) {
                console.log("Login successful! Role is:", userData.role);
            
                const userRole = userData.role ? userData.role.toLowerCase() : '';

                if (userRole === 'admin') {
                    navigate('/dashboard');
                } else if (userRole === 'cashier') {
                    navigate('/pos');
                } else {
                    navigate('/menu');
}
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
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