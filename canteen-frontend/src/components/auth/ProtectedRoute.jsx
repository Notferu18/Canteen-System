import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth(); 

if (loading) {
    return (
        <div className="flex min-h-screen bg-black text-white items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-600 text-xs uppercase tracking-widest">Verifying...</p>
            </div>
        </div>
    );
}

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;