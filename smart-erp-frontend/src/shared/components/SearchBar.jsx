import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search records...' }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 bg-[var(--bg-surface)] border-[var(--border-light)] text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
      />
    </div>
  );
}
