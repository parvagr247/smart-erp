import React from 'react';
import ActionButton from '@shared/components/ActionButton';
import { Input } from '@shared/components/ui/input';
import { Search } from 'lucide-react';
import './styles/LedgerFilterPanel.css';

export default function LedgerFilterPanel({
  search, setSearch, groups, groupId, setGroupId, isActive, setIsActive, balanceType, setBalanceType, onSearch
}) {
  return (
    <div className="filter-panel-container">
      <div className="filter-panel-search-wrap">
        <Input placeholder="Search name, GSTIN, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <ActionButton label="Search" icon={<Search size={14} />} onClick={onSearch} />
      </div>
      <div className="filter-panel-controls-wrap">
        <select className="filter-panel-select" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="">-- All Groups --</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select className="filter-panel-select" value={isActive} onChange={(e) => setIsActive(e.target.value)}>
          <option value="">-- All Status --</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
        <select className="filter-panel-select" value={balanceType} onChange={(e) => setBalanceType(e.target.value)}>
          <option value="">-- All Balance Types --</option>
          <option value="DEBIT">Debit (Dr)</option>
          <option value="CREDIT">Credit (Cr)</option>
        </select>
      </div>
    </div>
  );
}
