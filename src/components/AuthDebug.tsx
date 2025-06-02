'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function AuthDebug() {
  const { user, profile, session, isLoading, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono"
      >
        🐛 Debug
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-md text-xs font-mono space-y-2 max-h-96 overflow-y-auto">
          <div className="font-bold text-yellow-300">Auth Debug Info</div>
          
          <div>
            <span className="text-blue-300">isLoading:</span> {isLoading.toString()}
          </div>
          
          <div>
            <span className="text-blue-300">isAuthenticated:</span> {isAuthenticated.toString()}
          </div>
          
          <div>
            <span className="text-blue-300">user:</span> {user ? 'exists' : 'null'}
          </div>
          
          {user && (
            <div className="pl-2 border-l border-gray-600">
              <div><span className="text-green-300">id:</span> {user.id}</div>
              <div><span className="text-green-300">email:</span> {user.email}</div>
              <div><span className="text-green-300">created_at:</span> {user.created_at}</div>
            </div>
          )}
          
          <div>
            <span className="text-blue-300">profile:</span> {profile ? 'exists' : 'null'}
          </div>
          
          {profile && (
            <div className="pl-2 border-l border-gray-600">
              <div><span className="text-green-300">name:</span> {profile.name}</div>
              <div><span className="text-green-300">email:</span> {profile.email}</div>
              <div><span className="text-green-300">is_active:</span> {profile.is_active?.toString()}</div>
            </div>
          )}
          
          <div>
            <span className="text-blue-300">session:</span> {session ? 'exists' : 'null'}
          </div>
          
          {session && (
            <div className="pl-2 border-l border-gray-600">
              <div><span className="text-green-300">expires_at:</span> {new Date(session.expires_at! * 1000).toLocaleString()}</div>
              <div><span className="text-green-300">token_type:</span> {session.token_type}</div>
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-600">
            <div className="text-yellow-300">Browser Info:</div>
            <div className="text-xs space-y-1">
              <div>Cookies: {typeof window !== 'undefined' ? (document.cookie || 'no visible cookies') : 'server side'}</div>
              <div>LocalStorage: {typeof window !== 'undefined' ? (localStorage.length > 0 ? `${localStorage.length} items` : 'empty') : 'server side'}</div>
              <div>URL: {typeof window !== 'undefined' ? window.location.href : 'server side'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 