import React from 'react';

export default function PurchaseStatusBadge({ status }) {
  const styles = {
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/50',
    APPROVED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
    RECEIVED: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
}
