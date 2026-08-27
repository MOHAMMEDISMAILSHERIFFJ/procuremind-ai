// src/components/icons/Icons.jsx
import React from 'react';

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const DashboardIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <rect width="7" height="9" x="3" y="3" rx="1.5" />
    <rect width="7" height="5" x="14" y="3" rx="1.5" />
    <rect width="7" height="9" x="14" y="12" rx="1.5" />
    <rect width="7" height="5" x="3" y="16" rx="1.5" />
  </svg>
);

export const ProcurementIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const AiAnalysisIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export const VendorsIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);

export const SubscriptionsIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

export const DecisionsIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const SettingsIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const HelpIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export const BellIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const CreditCardIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export const TrendingUpIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const ShieldAlertIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const CheckSquareIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="m9 12 2 2 4-4" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export const AlertTriangleIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

export const SparklesIcon = ({ className = '', size = 20, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

export const ArrowUpRightIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <line x1="7" x2="17" y1="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export const ArrowDownRightIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <line x1="7" x2="17" y1="7" y2="17" />
    <polyline points="17 7 17 17 7 17" />
  </svg>
);

export const ChevronRightIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const CheckCircleIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const XCircleIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" x2="9" y1="9" y2="15" />
    <line x1="9" x2="15" y1="9" y2="15" />
  </svg>
);

export const ClockIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const FilterIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const SearchIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

export const RefreshIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

export const PlusIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const UsersIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const MessageSquareIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const ChevronDownIcon = ({ className = '', size = 16, ...props }) => (
  <svg {...iconProps} width={size} height={size} className={className} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const BrainSparkleLogo = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="32" height="32" rx="8" fill="#1E3A8A" />
    <path d="M16 6V10M16 22V26M6 16H10M22 16H26" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="16" r="6" stroke="#93C5FD" strokeWidth="2" fill="#2563EB" />
    <path d="M13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
  </svg>
);

export const DynamicIcon = ({ name, size = 20, className = '', ...props }) => {
  const map = {
    Dashboard: DashboardIcon,
    Procurement: ProcurementIcon,
    AiAnalysis: AiAnalysisIcon,
    Vendors: VendorsIcon,
    Subscriptions: SubscriptionsIcon,
    Decisions: DecisionsIcon,
    Settings: SettingsIcon,
    Help: HelpIcon,
    Bell: BellIcon,
    CreditCard: CreditCardIcon,
    TrendingUp: TrendingUpIcon,
    ShieldAlert: ShieldAlertIcon,
    CheckSquare: CheckSquareIcon,
    AlertTriangle: AlertTriangleIcon,
    Sparkles: SparklesIcon,
    Clock: ClockIcon,
  };

  const Component = map[name] || DashboardIcon;
  return <Component size={size} className={className} {...props} />;
};
