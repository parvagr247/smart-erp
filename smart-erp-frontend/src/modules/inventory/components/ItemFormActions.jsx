import React from 'react';
import './styles/ItemFormActions.css';

export default function ItemFormActions({ onCancel, loading }) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm transition cursor-pointer disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition cursor-pointer disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Stock Item"}
      </button>
    </div>
  );
}
