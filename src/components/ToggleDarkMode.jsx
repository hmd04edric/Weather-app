import React, { useEffect, useState } from 'react';

const ToggleDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="ml-4 p-2 bg-gray-200 dark:bg-gray-700 rounded"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};

export default ToggleDarkMode;
