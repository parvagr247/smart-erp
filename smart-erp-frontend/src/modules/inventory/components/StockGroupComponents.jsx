import React, { useState } from 'react';
import './styles/StockGroupComponents.css';

export function StockGroupForm({ groups, submitLoading, message, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ name: name.trim(), description: description.trim(), code: parentId || null }, () => { setName(''); setDescription(''); setParentId(''); });
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit text-left">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Stock Group</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Group Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="e.g. Raw Materials, Finished Goods" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none" placeholder="Group purpose" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Parent Stock Group (Optional)</label>
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm cursor-pointer">
            <option value="">None (Primary Group)</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <button type="submit" disabled={submitLoading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition cursor-pointer">{submitLoading ? "Adding..." : "Add Group"}</button>
        {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
      </form>
    </div>
  );
}

export function StockGroupList({ groups, onDelete }) {
  const renderIndentedList = () => {
    const map = {};
    groups.forEach(g => { map[g.id] = { ...g, children: [] }; });
    const roots = [];
    groups.forEach(g => {
      if (g.parentGroup && map[g.parentGroup.id]) map[g.parentGroup.id].children.push(map[g.id]);
      else roots.push(map[g.id]);
    });
    const output = [];
    const traverse = (node, depth = 0) => {
      output.push(
        <tr 
          key={node.id} 
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Delete') {
              onDelete(node.id);
              e.preventDefault();
            }
          }}
          className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 focus:bg-indigo-500/10 focus:outline-none"
        >
          <td className="py-3 px-4 text-slate-800 dark:text-slate-200" style={{ paddingLeft: `${depth * 20 + 16}px` }}><span className="text-slate-400 mr-2">└─</span><span className="font-medium">{node.name}</span></td>
          <td className="py-3 px-4 text-slate-500 text-xs">{node.description || '-'}</td>
          <td className="py-3 px-4 text-right"><button onClick={() => onDelete(node.id)} className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer" tabIndex={-1}>Delete</button></td>
        </tr>
      );
      node.children.forEach(c => traverse(c, depth + 1));
    };
    roots.forEach(r => traverse(r, 0));
    return output;
  };

  return (
    <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-left">
      <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Hierarchical Groups Tree</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="py-2 px-4 font-semibold">Group Name</th>
              <th className="py-2 px-4 font-semibold">Description</th>
              <th className="py-2 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? <tr><td colSpan="3" className="py-4 text-center text-slate-400">No stock groups added yet.</td></tr> : renderIndentedList()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
