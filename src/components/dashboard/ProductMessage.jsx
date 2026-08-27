// src/components/dashboard/ProductMessage.jsx
import React from 'react';
import { SparklesIcon } from '../icons/Icons';

export const ProductMessage = () => {
  return (
    <footer className="dashboard-footer">
      <div className="product-message-container">
        <div className="footer-sparkle-icon">
          <SparklesIcon size={16} />
        </div>
        <p className="product-tagline">
          "From tracking expenses to making smarter procurement decisions."
        </p>
      </div>
      <div className="footer-subtext">
        <span>ProcureMind AI Enterprise Intelligence</span>
        <span className="footer-separator">•</span>
        <span>Neural Decision Heuristics v2.4</span>
        <span className="footer-separator">•</span>
        <span className="footer-status-pill">
          <span className="footer-status-dot" /> All Systems Operational
        </span>
      </div>
    </footer>
  );
};
