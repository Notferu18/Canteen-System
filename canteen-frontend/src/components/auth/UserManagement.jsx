import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, RefreshCw, ShieldCheck, User, Users } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'cashier' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/users', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.post('http://127.0.0.1:8000/api/register', form, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setIsModalOpen(false);
            setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'cashier' });
            fetchUsers();
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) setErrors(serverErrors);
            else setErrors({ general: 'Failed to create user.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Failed to delete user.');
        }
    };

    const roleStyle = {
        admin:    'bg-red-600/10 text-red-500 border-red-800/30',
        cashier:  'bg-blue-900/20 text-blue-400 border-blue-800/30',
        customer: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    };

    const roleIcon = {
        admin:    <ShieldCheck size={12} />,
        cashier:  <User size={12} />,
        customer: <Users size={12} />,
    };

    const counts = {
        admin:    users.filter(u => u.role === 'admin').length,
        cashier:  users.filter(u => u.role === 'cashier').length,
        customer: users.filter(u => u.role === 'customer').length,
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-widest text-white">
                        User <span className="text-red-600">Management</span>
                    </h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                        Manage accounts and access roles
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchUsers}
                        className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-sm transition"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-sm text-xs font-black uppercase tracking-widest transition"
                    >
                        <UserPlus size={14} />
                        Add User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {Object.entries(counts).map(([role, count]) => (
                    <div key={role} className="bg-zinc-950 border border-zinc-900 rounded-sm p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-sm border ${roleStyle[role]}`}>
                            {roleIcon[role]}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{role}s</p>
                            <p className="text-2xl font-black text-white">{count}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border border-zinc-900 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-950 border-b border-zinc-900">
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Name</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Role</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Joined</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-700 text-xs uppercase tracking-widest">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition">
                                    <td className="p-4 text-sm font-bold uppercase text-white">{user.name}</td>
                                    <td className="p-4 text-sm text-zinc-400 font-mono">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${roleStyle[user.role] || roleStyle.customer}`}>
                                            {roleIcon[user.role]}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-zinc-600 font-mono">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-zinc-700 hover:text-red-500 transition p-1.5 hover:bg-red-900/10 rounded-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-8 w-full max-w-md">
                        <h2 className="text-sm font-black uppercase tracking-widest text-white mb-6">
                            Create New User
                        </h2>

                        {errors.general && (
                            <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-xs px-4 py-3 rounded-sm mb-4 uppercase tracking-wide">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">Name</label>
                                <input
                                    type="text" name="name" placeholder="Full Name"
                                    value={form.name} onChange={handleChange}
                                    className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors ${errors.name ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">Email</label>
                                <input
                                    type="email" name="email" placeholder="email@example.com"
                                    value={form.email} onChange={handleChange}
                                    className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors ${errors.email ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                                />
                                {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">Role</label>
                                <select
                                    name="role" value={form.role} onChange={handleChange}
                                    className="w-full bg-black border border-zinc-800 focus:border-red-600 px-4 py-3 text-sm text-white outline-none rounded-sm transition-colors"
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">Password</label>
                                <input
                                    type="password" name="password" placeholder="••••••••"
                                    value={form.password} onChange={handleChange}
                                    className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors ${errors.password ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                                />
                                {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">Confirm Password</label>
                                <input
                                    type="password" name="password_confirmation" placeholder="••••••••"
                                    value={form.password_confirmation} onChange={handleChange}
                                    className={`w-full bg-black border px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none rounded-sm transition-colors ${errors.password_confirmation ? 'border-red-600' : 'border-zinc-800 focus:border-red-600'}`}
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-[10px] mt-1">{errors.password_confirmation}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit" disabled={submitting}
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 py-2.5 font-black text-xs uppercase tracking-widest transition rounded-sm"
                                >
                                    {submitting ? 'Creating...' : 'Create User'}
                                </button>
                                <button
                                    type="button" onClick={() => { setIsModalOpen(false); setErrors({}); }}
                                    className="flex-1 border border-zinc-700 py-2.5 hover:bg-zinc-900 transition text-xs uppercase font-black tracking-widest text-zinc-400 rounded-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;