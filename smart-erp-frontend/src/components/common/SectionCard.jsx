import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SectionCard({ title, description, children, className = '' }) {
  return (
    <Card className={`bg-[var(--bg-surface)] border border-[var(--border-light)] shadow-xs ${className}`}>
      {(title || description) && (
        <CardHeader className="pb-4 border-b border-[var(--border-light)] text-left">
          {title && <CardTitle className="text-base font-bold font-heading text-[var(--text-primary)]">{title}</CardTitle>}
          {description && <CardDescription className="text-xs text-[var(--text-secondary)]">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-5 pb-5">
        {children}
      </CardContent>
    </Card>
  );
}
