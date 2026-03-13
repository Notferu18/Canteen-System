import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="flex items-center justify-center min-h-[300px] bg-zinc-950 border border-zinc-900 rounded-sm p-8">
                    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                        <div className="p-4 bg-red-600/10 rounded-sm">
                            <AlertTriangle size={28} className="text-red-500" />
                        </div>

                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                                Something Went Wrong
                            </h2>
                            <p className="text-[11px] text-zinc-500 uppercase tracking-wide">
                                This component encountered an unexpected error.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="w-full bg-black border border-zinc-800 rounded-sm px-4 py-3 text-left">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Error</p>
                                <p className="text-[11px] text-red-400 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all"
                        >
                            <RefreshCw size={12} />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;