import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Box } from 'lucide-react';
import '../../styles/DashboardView.css';

export default function InventoryView({ onBack }) {
  return (
    <div className="placeholder-page bg-[var(--bg-base)]">
      <div className="placeholder-icon">
        <Box size={36} className="stroke-[2.5]" />
      </div>
      <h1 className="placeholder-title">Inventory Module</h1>
      <p className="placeholder-desc">
        Stock items, warehouses, unit configurations, and physical stock vouchers are coming soon.
      </p>
      <Button 
        onClick={onBack} 
        variant="outline" 
        className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer flex items-center gap-1.5"
      >
        <ChevronLeft size={16} />
        Back to Dashboard
      </Button>
    </div>
  );
}
