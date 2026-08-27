// src/context/AuthContext.jsx
import React, { useState, useMemo } from 'react';
import { AuthContext } from './authContextInstance';
import {
  getCurrentUserData,
  saveUserData,
  createEmptyDataset,
  calculateMetrics,
  addVendor,
  addProcurementRequest,
  addSubscription,
  addInvoice,
  createDecisionFromInsight,
  updateDecisionStatus,
  updateProcurementRequestStatus,
  resolveInsight,
  loadDemoData,
  clearProcurementData,
} from '../services/dataService';

const REGISTERED_USERS_KEY = 'procuremind_registered_users';
const CURRENT_USER_KEY     = 'procuremind_current_user';
const LOGGED_IN_KEY        = 'procuremind_logged_in';

// ─────────────────────────────────────────────────────────────────────────────
// Pre-seeded demo account
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_DEMO_USER = {
  id: 'demo-user-novatech',
  username: 'demo',
  email: 'demo@procuremind.ai',
  password: 'demo123',
  fullName: 'Vikram Mehta',
  companyName: 'NovaTech Industries',
  jobRole: 'Head of Strategic Procurement',
  department: 'Engineering & Procurement',
  companyDescription: 'Industrial Advanced Technologies & Hardware manufacturing.',
  workDescription: 'Responsible for multi-million dollar annual direct & indirect procurement, vendor rate cards, and SaaS renewals.',
  procurementTypes: 'Laptops, SaaS, Lab Equipment, Cloud Compute, Ergonomics',
  accountCreatedAt: '2026-08-01T00:00:00.000Z',
  isDemo: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  // Initialize registered user list in localStorage
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.some((u) => u.email === DEFAULT_DEMO_USER.email)) {
            parsed.push(DEFAULT_DEMO_USER);
            localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch {}
    const initialList = [DEFAULT_DEMO_USER];
    try { localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(initialList)); } catch {}
    return initialList;
  });

  // Current session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
      if (localStorage.getItem(LOGGED_IN_KEY) === 'true') return DEFAULT_DEMO_USER;
    } catch {}
    return null;
  });

  // Current user's isolated procurement dataset
  const [userData, setUserData] = useState(() => {
    if (!currentUser) return null;
    if (currentUser.isDemo) {
      // Demo account: load demo data on first access
      const stored = getCurrentUserData(currentUser.id);
      if (!stored || !stored.isDemoData) {
        return loadDemoData(currentUser.id, currentUser.companyName);
      }
      return stored;
    }
    return getCurrentUserData(currentUser.id);
  });

  // Live metrics — recomputed whenever userData changes
  const metrics = useMemo(() => calculateMetrics(userData), [userData]);

  // ── Internal helpers ────────────────────────────────────────────────────────

  function _setAndPersistUser(safeUser) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    } catch {}
    setCurrentUser(safeUser);
  }

  function _syncUserData(userId, isDemo) {
    if (isDemo) {
      const stored = getCurrentUserData(userId);
      if (!stored || !stored.isDemoData) {
        const demo = loadDemoData(userId);
        setUserData(demo);
        return demo;
      }
      setUserData(stored);
      return stored;
    }
    const data = getCurrentUserData(userId);
    setUserData(data);
    return data;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Log in by username/email + password. */
  const login = (usernameOrEmail, password) => {
    const clean = usernameOrEmail.trim().toLowerCase();
    let latestUsers = users;
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (stored) latestUsers = JSON.parse(stored);
    } catch {}

    const matched = latestUsers.find(
      (u) =>
        (u.username?.toLowerCase() === clean || u.email?.toLowerCase() === clean) &&
        u.password === password
    );
    if (!matched) return { success: false, error: 'Invalid username or password.' };

    const safeUser = { ...matched };
    delete safeUser.password;
    _setAndPersistUser(safeUser);
    _syncUserData(safeUser.id, safeUser.isDemo);

    return { success: true, user: safeUser };
  };

  /** Register a new user with completely EMPTY data. */
  const register = (registrationData) => {
    const {
      fullName, username, password, email, companyName,
      jobRole, department, companyDescription, workDescription, procurementTypes,
    } = registrationData;

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail    = email.trim().toLowerCase();

    if (users.some((u) => u.username?.toLowerCase() === cleanUsername))
      return { success: false, error: 'Username is already taken. Please choose another.' };
    if (users.some((u) => u.email?.toLowerCase() === cleanEmail))
      return { success: false, error: 'An account with this email already exists.' };

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      fullName:           fullName.trim(),
      username:           username.trim(),
      email:              cleanEmail,
      password,
      companyName:        companyName.trim(),
      jobRole:            jobRole.trim(),
      department:         department.trim(),
      companyDescription: companyDescription.trim(),
      workDescription:    workDescription.trim(),
      procurementTypes:   procurementTypes || 'General',
      accountCreatedAt:   new Date().toISOString(),
      isDemo:             false,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    try { localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers)); } catch {}

    // Initialize EMPTY dataset — NEVER use demo data for new accounts
    const emptyData = createEmptyDataset(newUser.id, newUser.companyName);
    saveUserData(newUser.id, emptyData);

    const safeUser = { ...newUser };
    delete safeUser.password;
    _setAndPersistUser(safeUser);
    setUserData(emptyData);

    return { success: true, user: safeUser };
  };

  /** Log out — clears session, keeps account in localStorage. */
  const logout = () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(LOGGED_IN_KEY);
    } catch {}
    setCurrentUser(null);
    setUserData(null);
  };

  /** Refresh user data from localStorage (e.g. after external write). */
  const refreshData = () => {
    if (currentUser) _syncUserData(currentUser.id, currentUser.isDemo);
  };

  // ── Data mutation actions ───────────────────────────────────────────────────

  const addVendorAction = (vendor) => {
    if (!currentUser) return;
    const updated = addVendor(currentUser.id, vendor);
    setUserData({ ...updated });
  };

  const addProcurementAction = (req) => {
    if (!currentUser) return;
    const updated = addProcurementRequest(currentUser.id, req);
    setUserData({ ...updated });
  };

  const addSubscriptionAction = (sub) => {
    if (!currentUser) return;
    const updated = addSubscription(currentUser.id, sub);
    setUserData({ ...updated });
  };

  const addInvoiceAction = (invoice) => {
    if (!currentUser) return;
    const updated = addInvoice(currentUser.id, invoice);
    setUserData({ ...updated });
  };

  const createDecisionFromInsightAction = (insight) => {
    if (!currentUser || !insight) return;
    const updated = createDecisionFromInsight(currentUser.id, insight);
    setUserData({ ...updated });
    return updated;
  };

  /** Load full NovaTech demo dataset into current user's account. */
  const loadDemoDataAction = () => {
    if (!currentUser) return;
    const demo = loadDemoData(currentUser.id, currentUser.companyName);
    setUserData({ ...demo });
  };

  /** Clear all procurement data, reset to zero state. */
  const clearDataAction = () => {
    if (!currentUser) return;
    const empty = clearProcurementData(currentUser.id, currentUser.companyName);
    setUserData({ ...empty });
  };

  const updateDecisionStatusAction = (decisionId, newStatus, outcomeData) => {
    if (!currentUser) return;
    const updated = updateDecisionStatus(currentUser.id, decisionId, newStatus, outcomeData);
    setUserData({ ...updated });
    return updated;
  };

  const updateProcurementStatusAction = (reqId, newStatus, statusVariant) => {
    if (!currentUser) return;
    const updated = updateProcurementRequestStatus(currentUser.id, reqId, newStatus, statusVariant);
    setUserData({ ...updated });
    return updated;
  };

  const resolveInsightAction = (insightId, resolutionType, notes) => {
    if (!currentUser) return;
    const updated = resolveInsight(currentUser.id, insightId, resolutionType, notes);
    setUserData({ ...updated });
    return updated;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    userData,
    metrics,
    login,
    register,
    logout,
    refreshData,
    // Data mutations
    addVendor:                  addVendorAction,
    addProcurement:             addProcurementAction,
    addSubscription:            addSubscriptionAction,
    addInvoice:                 addInvoiceAction,
    createDecisionFromInsight:  createDecisionFromInsightAction,
    addDecision:                createDecisionFromInsightAction,
    updateDecisionStatus:       updateDecisionStatusAction,
    updateProcurementStatus:    updateProcurementStatusAction,
    resolveInsight:             resolveInsightAction,
    loadDemoData:               loadDemoDataAction,
    clearData:                  clearDataAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

