'use client';

import { useState, useEffect } from 'react';

const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-4xl font-bold text-black">
        {formatDate(dateTime)}
      </div>
      <div className="text-2xl md:text-3xl font-medium text-gray-700">
        {formatTime(dateTime)}
      </div>
    </div>
  );
};

export default LiveDateTime;
