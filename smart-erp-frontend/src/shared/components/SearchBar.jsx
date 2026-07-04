import React from 'react';
import { Input } from '@shared/components/ui/input';
import { Search } from 'lucide-react';
import { useSearchBarData } from './services/SearchBarService';
import './styles/SearchBar.css';

export default function SearchBar(props) {
  const { value, placeholder = 'Search records...' } = props;
  const { handleChange } = useSearchBarData(props);

  return (
    <div className="search-bar-wrapper">
      <Search className="search-bar-icon" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="search-bar-input"
      />
    </div>
  );
}
