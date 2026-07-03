import React, { useEffect, useState } from 'react';
import { inventoryService } from '../../services/inventory.service';

export default function StockGroupsView() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await inventoryService.getGroups();
      if (res.success && res.data) {
        setGroups(res.data);
      }
    } catch (e) {
      console.error("Error loading groups", e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      const res = await inventoryService.createGroup({
        name: name.trim(),
        description: description.trim(),
        code: parentId || null // Send parentId in the code field to match Controller binder
      });
      if (res.success) {
        setName('');
        setDescription('');
        setParentId('');
        setMessage("Stock Group created.");
        fetchGroups();
      } else {
        setMessage(res.message || "Failed to create.");
      }
    } catch (err) {
      setMessage("Error saving stock group.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this stock group?")) return;
    try {
      await inventoryService.deleteGroup(id);
      fetchGroups();
    } catch (e) {
      console.error(e);
    }
  };

  // Build indented hierarchy representation
  const renderIndentedList = () => {
    const map = {};
    groups.forEach(g => {
      map[g.id] = { ...g, children: [] };
    });

    const roots = [];
    groups.forEach(g => {
      if (g.parentGroup && map[g.parentGroup.id]) {
        map[g.parentGroup.id].children.push(map[g.id]);
      } else {
        roots.push(map[g.id]);
      }
    });

    const output = [];
    const traverse = (node, depth = 0) => {
      output.push(
        <tr key={node.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
          <td className="py-3 px-4 text-slate-800 dark:text-slate-200" style={{ paddingLeft: `${depth * 20 + 16}px` }}>
            <span className="text-slate-400 mr-2">└─</span>
            <span className="font-medium">{node.name}</span>
          </td>
          <td className="py-3 px-4 text-slate-500 text-xs">{node.description || '-'}</td>
          <td className="py-3 px-4 text-right">
            <button
              onClick={() => handleDelete(node.id)}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Delete
            </button>
          </td>
        </tr>
      );
      node.children.forEach(c => traverse(c, depth + 1));
    };

    roots.forEach(r => traverse(r, 0));
    return output;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Stock Groups Hierarchy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Organize your inventory stock items into primary and nested classifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm h-fit">
          <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Add Stock Group</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Group Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="e.g. Raw Materials, Finished Goods"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                placeholder="Group purpose"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Parent Group (optional)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="">Primary (No Parent)</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
            >
              {loading ? "Adding..." : "Add Group"}
            </button>
            {message && <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center">{message}</p>}
          </form>
        </div>

        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
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
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-slate-400">No stock groups added yet.</td>
                  </tr>
                ) : (
                  renderIndentedList()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
