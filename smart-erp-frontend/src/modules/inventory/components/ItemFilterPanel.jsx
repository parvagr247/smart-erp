import React from 'react';
import './styles/ItemFilterPanel.css';

export default function ItemFilterPanel({
  search, setSearch, selectedWarehouse, setSelectedWarehouse, selectedBrand, setSelectedBrand,
  selectedStatus, setSelectedStatus, warehouses, brands, onSearchSubmit, setPage
}) {
  return (
    <div className="filter-panel-container">
      <form onSubmit={onSearchSubmit} className="search-form">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="search-input" 
          placeholder="Search by Name, SKU, Code..." 
        />
        <button type="submit" className="search-btn">Search</button>
      </form>
      <div className="select-filters-wrap">
        <select value={selectedWarehouse} onChange={(e) => { setSelectedWarehouse(e.target.value); setPage(0); }} className="filter-select">
          <option value="">All Warehouses</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setPage(0); }} className="filter-select">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }} className="filter-select">
          <option value="">All Stock Status</option>
          <option value="LOW_STOCK">Low Stock Warning</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}
