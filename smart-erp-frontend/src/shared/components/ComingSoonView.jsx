import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';

export default function ComingSoonView({ moduleName, description, requiredPermissions, icon }) {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center space-y-6 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-8">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full">
          {icon || <span className="text-2xl font-bold">ERP</span>}
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
            Coming Soon
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{moduleName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>

        {requiredPermissions && requiredPermissions.length > 0 && (
          <div className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Required Security Scope
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {requiredPermissions.map((perm, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded text-[10px]">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition"
        >
          Return to Dashboard
        </button>
      </div>
    </PageContainer>
  );
}
