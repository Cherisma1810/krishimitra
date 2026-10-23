import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-stone-50">
        <div className="text-emerald-800 font-semibold text-base animate-pulse">
          డ్యాష్‌బోర్డ్ లోడ్ అవుతోంది... (Loading Dashboard...)
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}