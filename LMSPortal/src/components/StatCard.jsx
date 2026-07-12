import React from 'react';

export default function StatCard({ title, value, icon: Icon, theme = 'default' }) {
  // Theme classes: 'default' (indigo), 'success' (emerald), 'warning' (amber)
  const themeClass = theme !== 'default' ? ` ${theme}` : '';

  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper${themeClass}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-info">
        <span className="stat-val">{value}</span>
        <span className="stat-lbl">{title}</span>
      </div>
    </div>
  );
}
