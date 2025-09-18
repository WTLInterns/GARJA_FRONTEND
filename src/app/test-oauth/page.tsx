'use client';

import GoogleOAuthButton from '@/components/GoogleOAuthButton';
import { useState } from 'react';

export default function TestOAuthPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendOAuth = async () => {
    setTestResults([]);
    addResult('Testing backend OAuth endpoint...');

    try {
      const response = await fetch('https://api.mygarja.com/oauth2/authorization/google', {
        method: 'GET',
        redirect: 'manual'
      });
      
      if (response.type === 'opaqueredirect' || response.status === 0) {
        addResult('✅ Backend OAuth endpoint is working (redirect detected)');
      } else {
        addResult(`❌ Backend OAuth endpoint status: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Backend OAuth endpoint failed: ${error}`);
      addResult('Make sure backend is running: mvn spring-boot:run');
    }
  };

  const testDirectOAuth = () => {
    addResult('Testing direct OAuth redirect...');
    window.location.href = 'https://api.mygarja.com/oauth2/authorization/google?prompt=select_account';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Test Google OAuth</h1>
        
        <div className="space-y-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-semibold text-red-800 mb-2">🚨 If you see "Access blocked" error:</h3>
            <p className="text-sm text-red-700 mb-2">
              This means Google OAuth configuration is incorrect. Follow these steps:
            </p>
            <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
              <li>Go to Google Cloud Console</li>
              <li>Update OAuth consent screen (change app name from "Udemy" to "Garja")</li>
              <li>Add redirect URI: https://api.mygarja.com/login/oauth2/code/google</li>
              <li>Add your email as test user</li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={testBackendOAuth}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              1. Test Backend OAuth Endpoint
            </button>

            <GoogleOAuthButton />

            <button
              onClick={testDirectOAuth}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              3. Test Direct OAuth (Bypass Frontend)
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
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">What should happen:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Click "Continue with Google"</li>
              <li>Redirect to Google OAuth screen</li>
              <li>See "Choose an account to continue to Garja"</li>
              <li>Select your Google account</li>
              <li>Complete authentication and redirect back</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
