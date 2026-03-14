import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

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

        if (!email.trim()) { setError('Email is required'); return; }
        if (!password) { setError('Password is required'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return; }

        setLoading(true);
        try {
            const userData = await login(email, password);
            if (userData) {
                const routes = { admin: '/dashboard', cashier: '/pos', customer: '/customer/menu' };
                navigate(routes[userData.role?.toLowerCase()] || '/menu');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at top left, #3a0000 0%, #000000 50%, #1a0000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: '-100px', left: '-100px',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'rgba(180, 20, 20, 0.15)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-100px', right: '-100px',
                width: '350px', height: '350px', borderRadius: '50%',
                background: 'rgba(220, 38, 38, 0.1)',
                filter: 'blur(100px)', pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'rgba(220, 38, 38, 0.15)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        fontSize: '26px', marginBottom: '14px',
                        backdropFilter: 'blur(10px)',
                    }}>
                        🍽️
                    </div>
                    <h1 style={{
                        color: '#fff', fontSize: '22px', fontWeight: '900',
                        letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px',
                    }}>
                        BYTES<span style={{ color: '#dc2626' }}></span>
                    </h1>
                    <p style={{ color: '#52525b', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                        Sign in to your account
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '36px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>
                    {error && (
                        <div style={{
                            background: 'rgba(220, 38, 38, 0.1)',
                            border: '1px solid rgba(220, 38, 38, 0.25)',
                            borderRadius: '10px', padding: '12px 14px',
                            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
                            color: '#fca5a5', fontSize: '12px',
                            animation: 'shake 0.4s ease',
                        }}>
                            <AlertCircle size={14} style={{ flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{
                                display: 'block', color: '#a1a1aa', fontSize: '11px',
                                fontWeight: '700', letterSpacing: '0.15em',
                                textTransform: 'uppercase', marginBottom: '8px',
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                disabled={loading}
                                autoComplete="email"
                                style={{
                                    width: '100%', padding: '13px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${error && !email ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '10px', color: '#fff', fontSize: '14px',
                                    outline: 'none', boxSizing: 'border-box',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(10px)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block', color: '#a1a1aa', fontSize: '11px',
                                fontWeight: '700', letterSpacing: '0.15em',
                                textTransform: 'uppercase', marginBottom: '8px',
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    disabled={loading}
                                    autoComplete="current-password"
                                    style={{
                                        width: '100%', padding: '13px 48px 13px 16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${error && !password ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '10px', color: '#fff', fontSize: '14px',
                                        outline: 'none', boxSizing: 'border-box',
                                        transition: 'all 0.2s ease',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', color: '#52525b', cursor: 'pointer',
                                        padding: '4px', display: 'flex', alignItems: 'center',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px',
                                background: loading
                                    ? 'rgba(220,38,38,0.5)'
                                    : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                border: '1px solid rgba(220,38,38,0.4)',
                                borderRadius: '10px', color: '#fff',
                                fontSize: '12px', fontWeight: '900',
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: '0 4px 15px rgba(220,38,38,0.2)',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '14px', height: '14px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: '#fff', borderRadius: '50%',
                                        animation: 'spin 0.6s linear infinite',
                                    }} />
                                    Authenticating...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center', fontSize: '12px', color: '#52525b',
                    marginTop: '20px', letterSpacing: '0.05em',
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{
                        color: '#dc2626', fontWeight: '700', textDecoration: 'none',
                    }}>
                        Create an account
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                input::placeholder { color: #3f3f46; }
            `}</style>
        </div>
    );
};

export default Login;