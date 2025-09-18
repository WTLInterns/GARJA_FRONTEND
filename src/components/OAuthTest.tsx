'use client';

import React, { useState } from 'react';

const OAuthTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    addResult('Starting backend connection test...');

    try {
      // Test 1: Check if backend is running
      addResult('Testing backend server connection...');
      const response = await fetch('https://api.mygarja.com/auth/oauth2/success');
      
      if (response.ok) {
        addResult('✅ Backend server is running and reachable');
      } else {
        addResult(`❌ Backend server responded with status: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Backend server is not reachable: ${error}`);
      addResult('Make sure your backend is running on port 8085');
    }

    try {
      // Test 2: Check OAuth endpoint
      addResult('Testing OAuth endpoint...');
      const oauthResponse = await fetch('https://api.mygarja.com/auth/google', {
        method: 'GET',
        redirect: 'manual' // Don't follow redirects
      });
      
      if (oauthResponse.type === 'opaqueredirect' || oauthResponse.status === 0) {
        addResult('✅ OAuth endpoint is working (redirect detected)');
      } else {
        addResult(`OAuth endpoint status: ${oauthResponse.status}`);
      }
    } catch (error) {
      addResult(`OAuth endpoint test failed: ${error}`);
    }

    setIsLoading(false);
  };

  const testDirectOAuth = () => {
    addResult('Testing direct OAuth redirect...');
    window.location.href = 'https://api.mygarja.com/auth/google';
  };

  const testSpringOAuth = () => {
    addResult('Testing Spring OAuth2 endpoint...');
    window.location.href = 'https://api.mygarja.com/oauth2/authorization/google';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">OAuth Debug Tool</h2>
      
      <div className="space-y-4">
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </button>

        <button
          onClick={testDirectOAuth}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test OAuth via /auth/google
        </button>

        <button
          onClick={testSpringOAuth}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test OAuth via /oauth2/authorization/google
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800">Instructions:</h4>
        <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2">
          <li>First, click "Test Backend Connection" to verify your backend is running</li>
          <li>If backend is running, try "Test OAuth via /auth/google"</li>
          <li>If that doesn't work, try "Test OAuth via /oauth2/authorization/google"</li>
          <li>Check the browser console for additional error messages</li>
        </ol>
      </div>
    </div>
  );
};

export default OAuthTest;
