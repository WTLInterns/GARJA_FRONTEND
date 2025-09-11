'use client';

import React, { useState, useEffect } from 'react';

const StorageTestPage = () => {
  const [results, setResults] = useState<string[]>([]);
  
  useEffect(() => {
    runTests();
  }, []);

  const runTests = () => {
    const testResults: string[] = [];
    
    // Test 1: Check if localStorage is available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        testResults.push('✅ localStorage is available');
      } else {
        testResults.push('❌ localStorage is NOT available');
      }
    } catch (e) {
      testResults.push(`❌ Error checking localStorage: ${e}`);
    }

    // Test 2: Try to set an item
    try {
      localStorage.setItem('test_key', 'test_value');
      testResults.push('✅ Can set item in localStorage');
    } catch (e) {
      testResults.push(`❌ Cannot set item: ${e}`);
    }

    // Test 3: Try to get an item
    try {
      const value = localStorage.getItem('test_key');
      if (value === 'test_value') {
        testResults.push('✅ Can retrieve item from localStorage');
      } else {
        testResults.push(`⚠️ Retrieved value doesn't match: ${value}`);
      }
    } catch (e) {
      testResults.push(`❌ Cannot get item: ${e}`);
    }

    // Test 4: Try to store JSON
    try {
      const testObj = { id: 1, name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('test_json', JSON.stringify(testObj));
      const retrieved = JSON.parse(localStorage.getItem('test_json') || '{}');
      if (retrieved.id === 1) {
        testResults.push('✅ Can store and retrieve JSON objects');
      } else {
        testResults.push('⚠️ JSON storage issue');
      }
    } catch (e) {
      testResults.push(`❌ Cannot store JSON: ${e}`);
    }

    // Test 5: Check storage quota
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(({ usage, quota }) => {
          const percentUsed = usage && quota ? (usage / quota) * 100 : 0;
          setResults(prev => [...prev, `📊 Storage: ${usage} / ${quota} bytes (${percentUsed.toFixed(2)}% used)`]);
        });
      }
    } catch (e) {
      testResults.push(`⚠️ Cannot check storage quota: ${e}`);
    }

    // Test 6: Test with actual auth data structure
    try {
      const mockAuthData = {
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc1NzU3ODQ3MywiZXhwIjoxNzU3NjY0ODczfQ.OUbg2SH2Pmey9Ry3F-fz1QzS896Of3f6zhWTeUwrhXg',
        user: {
          id: 2,
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          phoneNumber: '1234567890'
        }
      };
      
      localStorage.setItem('garja_token', mockAuthData.token);
      localStorage.setItem('garja_user', JSON.stringify(mockAuthData.user));
      
      const retrievedToken = localStorage.getItem('garja_token');
      const retrievedUser = localStorage.getItem('garja_user');
      
      if (retrievedToken === mockAuthData.token && retrievedUser) {
        testResults.push('✅ Can store auth data format');
      } else {
        testResults.push('❌ Issue storing auth data');
      }
    } catch (e) {
      testResults.push(`❌ Cannot store auth data: ${e}`);
    }

    // Test 7: Check for privacy mode / incognito
    try {
      const testKey = '_test_private_' + Date.now();
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      testResults.push('✅ Not in private/incognito mode');
    } catch (e) {
      testResults.push('⚠️ Might be in private/incognito mode');
    }

    // Cleanup
    try {
      localStorage.removeItem('test_key');
      localStorage.removeItem('test_json');
      localStorage.removeItem('garja_token');
      localStorage.removeItem('garja_user');
    } catch (e) {
      // Ignore cleanup errors
    }

    setResults(testResults);
  };

  const testManualSave = () => {
    try {
      const token = prompt('Enter JWT token:');
      if (token) {
        localStorage.setItem('garja_token', token);
        const saved = localStorage.getItem('garja_token');
        if (saved === token) {
          alert('✅ Token saved successfully!');
        } else {
          alert('❌ Token save failed!');
        }
      }
    } catch (e) {
      alert(`Error: ${e}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">localStorage Diagnostic Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="font-mono text-sm">
                {result}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Information:</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>User Agent: {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</div>
            <div>Cookies Enabled: {typeof window !== 'undefined' ? navigator.cookieEnabled ? 'Yes' : 'No' : 'N/A'}</div>
            <div>Do Not Track: {typeof window !== 'undefined' ? navigator.doNotTrack : 'N/A'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Tests:</h2>
          <div className="space-y-4">
            <button
              onClick={runTests}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Re-run Tests
            </button>
            <button
              onClick={testManualSave}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Manual Token Save
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Common Issues:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Private/Incognito mode may restrict localStorage</li>
            <li>Browser extensions may block localStorage</li>
            <li>Third-party cookies blocked may affect storage</li>
            <li>Storage quota exceeded</li>
            <li>Browser security settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StorageTestPage;
