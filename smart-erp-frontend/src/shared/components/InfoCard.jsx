import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import './styles/InfoCard.css';

export default function InfoCard({ title, items }) {
  return (
    <Card className="info-card-container">
      {title && (
        <CardHeader className="info-card-header">
          <CardTitle className="info-card-title">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="info-card-content">
        <div className="info-card-grid">
          {items.map((item, idx) => (
            <div key={idx} className="info-card-item">
              <span className="info-card-label">
                {item.label}
              </span>
              <span className="info-card-value">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
