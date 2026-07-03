import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import '@shared/styles/CommonComponents.css';

export default function InfoCard({ title, items }) {
  return (
    <Card className="bg-[var(--bg-surface)] border border-[var(--border-light)] shadow-xs">
      {title && (
        <CardHeader className="pb-3 border-b border-[var(--border-light)]">
          <CardTitle className="text-sm font-bold font-heading text-[var(--text-primary)] text-left">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[var(--border-light)]/50 last:border-b-0">
              <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-[var(--text-primary)] font-bold">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
