import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@shared/components/ui/card';
import './styles/SectionCard.css';

export default function SectionCard({ title, description, children, className = '' }) {
  return (
    <Card className={`section-card-container ${className}`}>
      {(title || description) && (
        <CardHeader className="section-card-header">
          {title && <CardTitle className="section-card-title">{title}</CardTitle>}
          {description && <CardDescription className="section-card-desc">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="section-card-content">
        {children}
      </CardContent>
    </Card>
  );
}
