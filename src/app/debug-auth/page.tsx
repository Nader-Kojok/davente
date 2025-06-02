'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DebugAuthPage() {
  const { user, profile, session, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [testResult, setTestResult] = useState<string>('');

  const testNavigation = async () => {
    setTestResult('Testing navigation...');
    
    try {
      // Test if we can navigate to profile
      router.push('/profil');
      setTestResult('Navigation initiated to /profil');
    } catch (error) {
      setTestResult(`Navigation error: ${error}`);
    }
  };

  const testDirectAccess = () => {
    setTestResult('Testing direct access...');
    window.location.href = '/profil';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid gap-6">
          {/* Current State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Authentication State</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className={`p-2 rounded ${isLoading ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <strong>isLoading:</strong> {isLoading.toString()}
              </div>
              <div className={`p-2 rounded ${isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>isAuthenticated:</strong> {isAuthenticated.toString()}
              </div>
              <div className={`p-2 rounded ${user ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>user:</strong> {user ? 'exists' : 'null'}
              </div>
              <div className={`p-2 rounded ${profile ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <strong>profile:</strong> {profile ? 'exists' : 'null'}
              </div>
              <div className={`p-2 rounded ${session ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>session:</strong> {session ? 'exists' : 'null'}
              </div>
            </div>
          </div>

          {/* Navigation Tests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
            <div className="space-y-4">
              <button
                onClick={testNavigation}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Test Router Navigation to /profil
              </button>
              
              <button
                onClick={testDirectAccess}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Test Direct Access to /profil
              </button>
              
              <a
                href="/profil"
                className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
              >
                Test Link to /profil
              </a>
              
              {testResult && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <strong>Test Result:</strong> {testResult}
                </div>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'server side'}
              </div>
              <div>
                <strong>Port:</strong> {typeof window !== 'undefined' ? window.location.port : 'server side'}
              </div>
              <div>
                <strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || 'not set'}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Access Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/profil" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                /profil
              </a>
              <a href="/parametres" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                /parametres
              </a>
              <a href="/mes-annonces" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                /mes-annonces
              </a>
              <a href="/favoris" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                /favoris
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 