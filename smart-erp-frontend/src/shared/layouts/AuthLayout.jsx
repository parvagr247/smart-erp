import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[var(--bg-base)] transition-colors duration-200">
      <div className="w-full max-w-md flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}
