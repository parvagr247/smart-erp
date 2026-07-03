import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { Briefcase, Calendar, FileText, MapPin, Phone, Trash2, Edit } from 'lucide-react';

export default function CompanyCard({ company, onSelect, onEdit, onDelete }) {
  const createdDate = company.createdAt 
    ? new Date(company.createdAt).toLocaleDateString()
    : 'N/A';

  return (
    <Card className="hover:border-[var(--primary)] transition-all flex flex-col justify-between bg-[var(--bg-surface)] border-[var(--border-light)] shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold font-heading truncate text-[var(--text-primary)]" title={company.name}>
              {company.name}
            </CardTitle>
            <CardDescription className="text-xs text-[var(--text-secondary)] font-mono">
              GST: {company.gstNumber}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-6 text-sm text-[var(--text-secondary)] flex-grow">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[var(--text-muted)]" />
          <span>FY: <strong className="text-[var(--text-primary)]">{company.financialYear}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[var(--text-muted)]" />
          <span className="truncate">State: <strong className="text-[var(--text-primary)]">{company.state}</strong></span>
        </div>
        {company.address && (
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 text-xs" title={company.address}>{company.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-light)]">
          <span>Created: {createdDate}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t border-[var(--border-light)] pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(company)}
          className="border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] cursor-pointer flex items-center gap-1"
        >
          <Edit size={14} />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(company)}
          className="border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer flex items-center gap-1"
        >
          <Trash2 size={14} />
          Delete
        </Button>
        <Button 
          size="sm" 
          onClick={() => onSelect(company)}
          className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer"
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
