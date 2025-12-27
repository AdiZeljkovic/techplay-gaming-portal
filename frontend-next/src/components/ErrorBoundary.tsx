'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in child component tree
 * Displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
                            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-400 mb-6">
                                We're sorry, but something unexpected happened. Please try again.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mb-6 text-left">
                                    <summary className="text-sm text-red-400 cursor-pointer hover:text-red-300">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-300 bg-red-500/10 p-3 rounded-lg overflow-x-auto max-w-full">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            )}

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={this.handleRetry}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Go Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
