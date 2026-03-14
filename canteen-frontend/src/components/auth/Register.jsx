import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const Register = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required.';
        if (!form.email.trim()) e.email = 'Email is required.';
        if (!form.password) e.password = 'Password is required.';
        if (form.password.length < 6) e.password = 'At least 6 characters.';
        if (form.password !== form.password_confirmation) e.password_confirmation = 'Passwords do not match.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (Object.keys(v).length > 0) { setErrors(v); return; }
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/register', form);
            const userData = await login(form.email, form.password);
            if (userData) navigate('/customer/menu');
        } catch (error) {
            const serverErrors = error.response?.data?.errors;
            if (serverErrors) setErrors(serverErrors);
            else setErrors({ general: 'Registration failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (hasError) => ({
        width: '100%', padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${hasError ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '10px', color: '#fff', fontSize: '14px',
        outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
    });

    const labelStyle = {
        display: 'block', color: '#a1a1aa', fontSize: '11px',
        fontWeight: '700', letterSpacing: '0.15em',
        textTransform: 'uppercase', marginBottom: '7px',
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at top left, #3a0000 0%, #000000 50%, #1a0000 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: '-100px', left: '-100px',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'rgba(180,20,20,0.15)', filter: 'blur(80px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-100px', right: '-100px',
                width: '350px', height: '350px', borderRadius: '50%',
                background: 'rgba(220,38,38,0.1)', filter: 'blur(100px)', pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
                        fontSize: '26px', marginBottom: '14px', backdropFilter: 'blur(10px)',
                    }}>🍽️</div>
                    <h1 style={{
                        color: '#fff', fontSize: '22px', fontWeight: '900',
                        letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px',
                    }}>
                        BYTES<span style={{ color: '#dc2626' }}></span>
                    </h1>
                    <p style={{ color: '#52525b', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                        Create your account
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>
                    {errors.general && (
                        <div style={{
                            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
                            borderRadius: '10px', padding: '12px 14px', marginBottom: '18px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            color: '#fca5a5', fontSize: '12px',
                        }}>
                            <AlertCircle size={14} style={{ flexShrink: 0 }} />
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text" name="name" placeholder="Juan Dela Cruz"
                                    value={form.name} onChange={handleChange} disabled={loading}
                                    style={inputStyle(errors.name)}
                                    onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}
                                />
                                {errors.name && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '5px' }}>{errors.name}</p>}
                            </div>

                            <div>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email" name="email" placeholder="juan@email.com"
                                    value={form.email} onChange={handleChange} disabled={loading}
                                    style={inputStyle(errors.email)}
                                    onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}
                                />
                                {errors.email && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '5px' }}>{errors.email}</p>}
                            </div>

                            <div>
                                <label style={labelStyle}>Password</label>
                                <input
                                    type="password" name="password" placeholder="••••••••"
                                    value={form.password} onChange={handleChange} disabled={loading}
                                    style={inputStyle(errors.password)}
                                    onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}
                                />
                                {errors.password && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '5px' }}>{errors.password}</p>}
                            </div>

                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <input
                                    type="password" name="password_confirmation" placeholder="••••••••"
                                    value={form.password_confirmation} onChange={handleChange} disabled={loading}
                                    style={inputStyle(errors.password_confirmation)}
                                    onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
                                    onBlur={e => e.target.style.borderColor = errors.password_confirmation ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.1)'}
                                />
                                {errors.password_confirmation && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '5px' }}>{errors.password_confirmation}</p>}
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '14px', marginTop: '24px',
                                background: loading ? 'rgba(220,38,38,0.5)' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                border: '1px solid rgba(220,38,38,0.4)', borderRadius: '10px',
                                color: '#fff', fontSize: '12px', fontWeight: '900',
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
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
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p style={{
                    textAlign: 'center', fontSize: '12px', color: '#52525b',
                    marginTop: '20px', letterSpacing: '0.05em',
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#dc2626', fontWeight: '700', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: #3f3f46; }
            `}</style>
        </div>
    );
};

export default Register;