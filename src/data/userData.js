// src/data/userData.js
/**
 * Backward-compatibility shim.
 * All logic has moved to src/services/dataService.js.
 * This file re-exports the functions so existing imports still work.
 */
export {
  createEmptyDataset as getInitialEmptyUserData,
  getCurrentUserData as getUserData,
  saveUserData,
  calculateMetrics as calculateUserMetrics,
  addVendor as addVendorToUserData,
  addProcurementRequest as addProcurementToUserData,
  addSubscription as addSubscriptionToUserData,
} from '../services/dataService';

export { buildDemoDataset as getDemoUserData } from './demoData';
