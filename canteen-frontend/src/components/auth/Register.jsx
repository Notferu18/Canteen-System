import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required.';
        if (!form.email.trim()) newErrors.email = 'Email is required.';
        if (!form.password) newErrors.password = 'Password is required.';
        if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (form.password !== form.password_confirmation)
            newErrors.password_confirmation = 'Passwords do not match.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/register', form);
            const userData = await login(form.email, form.password);
            if (userData) navigate('/menu');
        } catch (error) {
            const serverErrors = error.response?.data?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black uppercase tracking-[0.25em] text-white">
                        Canteen<span className="text-red-600">OS</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
                        Create your account
                    </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-8">
                    <h2 className="text-sm font-black uppercase tracking-widest text-white mb-6">
                        Register
                    </h2>

                    {errors.general && (
                        <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-xs px-4 py-3 rounded-sm mb-4 uppercase tracking-wide">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Juan Dela Cruz"
                                value={form.name}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors
                                    ${errors.name ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wide">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="juan@email.com"
                                value={form.email}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors
                                    ${errors.email ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wide">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors
                                    ${errors.password ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wide">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                placeholder="••••••••"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors
                                    ${errors.password_confirmation ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wide">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-3 rounded-sm transition mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-600 hover:text-red-400 transition font-bold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;