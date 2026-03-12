import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth(); 

    if (loading) {
        return (
            <div className="flex min-h-screen bg-black text-white items-center justify-center">
                <div className="text-xl font-mono tracking-widest">VERIFYING...</div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;