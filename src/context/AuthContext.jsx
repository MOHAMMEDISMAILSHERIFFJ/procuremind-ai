// src/context/AuthContext.jsx
import React, { useState, useMemo } from 'react';
import { AuthContext } from './authContextInstance';
import {
  getUserData,
  saveUserData,
  getInitialEmptyUserData,
  calculateUserMetrics,
  addVendorToUserData,
  addProcurementToUserData,
  addSubscriptionToUserData,
} from '../data/userData';

const REGISTERED_USERS_KEY = 'procuremind_registered_users';
const CURRENT_USER_KEY = 'procuremind_current_user';
const LOGGED_IN_KEY = 'procuremind_logged_in';

// Pre-seeded demo account for NovaTech Industries
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

export function AuthProvider({ children }) {
  // Initialize registered users list in localStorage
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
    } catch (err) {
      console.error('Error loading users from localStorage', err);
    }
    const initialList = [DEFAULT_DEMO_USER];
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(initialList));
    } catch {}
    return initialList;
  });

  // Current logged in user session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          return parsed;
        }
      }
      if (localStorage.getItem(LOGGED_IN_KEY) === 'true') {
        return DEFAULT_DEMO_USER;
      }
    } catch (err) {
      console.error('Error loading current user', err);
    }
    return null;
  });

  // Current user's isolated procurement dataset
  const [userData, setUserData] = useState(() => {
    if (currentUser) {
      return getUserData(currentUser.id, currentUser.isDemo, currentUser.companyName);
    }
    return null;
  });

  // Dynamically derived live metrics from current userData
  const metrics = useMemo(() => {
    return calculateUserMetrics(userData);
  }, [userData]);

  const refreshData = () => {
    if (currentUser) {
      const data = getUserData(currentUser.id, currentUser.isDemo, currentUser.companyName);
      setUserData(data);
    }
  };

  /**
   * Log in user by username/email and password.
   */
  const login = (usernameOrEmail, password) => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    let latestUsers = users;
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (stored) {
        latestUsers = JSON.parse(stored);
      }
    } catch {}

    const matchedUser = latestUsers.find(
      (u) =>
        (u.username?.toLowerCase() === cleanInput || u.email?.toLowerCase() === cleanInput) &&
        u.password === password
    );

    if (!matchedUser) {
      return { success: false, error: 'Invalid username or password.' };
    }

    const safeUser = { ...matchedUser };
    delete safeUser.password;

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    } catch {}

    const loadedData = getUserData(safeUser.id, safeUser.isDemo, safeUser.companyName);
    setCurrentUser(safeUser);
    setUserData(loadedData);

    return { success: true, user: safeUser };
  };

  /**
   * Register a new user with fresh EMPTY data.
   */
  const register = (registrationData) => {
    const {
      fullName,
      username,
      password,
      email,
      companyName,
      jobRole,
      department,
      companyDescription,
      workDescription,
      procurementTypes,
    } = registrationData;

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.username?.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username is already taken. Please choose another.' };
    }
    if (users.some((u) => u.email?.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      fullName: fullName.trim(),
      username: username.trim(),
      email: cleanEmail,
      password,
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      department: department.trim(),
      companyDescription: companyDescription.trim(),
      workDescription: workDescription.trim(),
      procurementTypes: procurementTypes || 'General',
      accountCreatedAt: new Date().toISOString(),
      isDemo: false,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
    } catch {}

    // Initialize completely EMPTY dataset for the new account
    const emptyDataset = getInitialEmptyUserData(newUser.id, newUser.companyName);
    saveUserData(newUser.id, emptyDataset);

    const safeUser = { ...newUser };
    delete safeUser.password;

    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    } catch {}

    setCurrentUser(safeUser);
    setUserData(emptyDataset);

    return { success: true, user: safeUser };
  };

  /**
   * Log out active user.
   */
  const logout = () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(LOGGED_IN_KEY);
    } catch {}
    setCurrentUser(null);
    setUserData(null);
  };

  /**
   * Actions to add records to current user's dataset live
   */
  const addVendor = (vendor) => {
    if (!currentUser) return;
    const updated = addVendorToUserData(currentUser.id, vendor);
    setUserData({ ...updated });
  };

  const addProcurement = (req) => {
    if (!currentUser) return;
    const updated = addProcurementToUserData(currentUser.id, req);
    setUserData({ ...updated });
  };

  const addSubscription = (sub) => {
    if (!currentUser) return;
    const updated = addSubscriptionToUserData(currentUser.id, sub);
    setUserData({ ...updated });
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    userData,
    metrics,
    login,
    register,
    logout,
    addVendor,
    addProcurement,
    addSubscription,
    refreshData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
