// src/components/dashboard/RecentProcurement.jsx
import React, { useState } from 'react';
import {
  ProcurementIcon,
  ChevronRightIcon,
  PlusIcon,
} from '../icons/Icons';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/useAuth';

export const RecentProcurement = () => {
  const { userData, addProcurement, currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // New Requisition Form State
  const [formData, setFormData] = useState({
    item: '',
    department: 'Engineering',
    amount: '',
    vendor: '',
    category: 'IT',
  });

  const procurements = userData?.procurements || [];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.item.trim() || !formData.amount) return;

    addProcurement({
      item: formData.item.trim(),
      department: formData.department,
      totalAmount: Number(formData.amount),
      vendor: formData.vendor.trim() || 'Direct Supplier',
      category: formData.category,
    });

    setFormData({
      item: '',
      department: 'Engineering',
      amount: '',
      vendor: '',
      category: 'IT',
    });
    setShowAddModal(false);
  };

  const getStatusBadge = (status, variant) => (
    <Badge variant={variant || 'under-review'} size="sm">
      {status || 'Under Review'}
    </Badge>
  );

  const getAiRecommendationBadge = (recommendation, actionType) => (
    <Badge variant={actionType || 'under-review'} size="sm">
      {recommendation || 'Under Review'}
    </Badge>
  );

  return (
    <div className="card recent-procurement-card">
      <div className="card-header">
        <div className="card-header-main">
          <div className="card-header-icon procurement-icon-wrapper">
            <ProcurementIcon size={20} />
          </div>
          <div>
            <h3 className="card-title">Recent Procurement</h3>
            <p className="card-subtitle">
              {currentUser?.companyName || 'Organization'} active requisitions with automated AI decision intelligence
            </p>
          </div>
        </div>

        <div className="table-header-controls">
          <button
            type="button"
            className="btn-add-record"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon size={14} />
            <span>Add Requisition</span>
          </button>
        </div>
      </div>

      <div className="card-body table-card-body">
        {procurements.length > 0 ? (
          <>
            <div className="table-responsive-wrapper">
              <table className="procurement-table">
                <thead>
                  <tr>
                    <th scope="col" className="th-request">Request</th>
                    <th scope="col" className="th-dept">Department</th>
                    <th scope="col" className="th-amount">Amount</th>
                    <th scope="col" className="th-status">Status</th>
                    <th scope="col" className="th-ai">AI Recommendation</th>
                    <th scope="col" className="th-actions"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {procurements.map((item) => (
                    <tr key={item.id} className="procurement-table-row">
                      <td className="td-request">
                        <div className="request-cell">
                          <span className="request-title">{item.request || item.item}</span>
                          <div className="request-meta">
                            <span className="request-id">{item.id}</span>
                            {item.vendor && <span className="request-vendor">&bull; {item.vendor}</span>}
                          </div>
                        </div>
                      </td>

                      <td className="td-dept">
                        <span className="dept-tag">{item.department}</span>
                      </td>

                      <td className="td-amount">
                        <span className="amount-value">{item.formattedAmount || `₹${Number(item.totalAmount).toLocaleString('en-IN')}`}</span>
                      </td>

                      <td className="td-status">
                        {getStatusBadge(item.status, item.statusVariant)}
                      </td>

                      <td className="td-ai">
                        {getAiRecommendationBadge(
                          item.aiRecommendation,
                          item.aiActionType
                        )}
                      </td>

                      <td className="td-actions">
                        <button
                          type="button"
                          className="btn-row-action"
                          aria-label={`View details for ${item.request || item.item}`}
                        >
                          <ChevronRightIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer-row">
              <span className="table-pagination-info">
                Showing {procurements.length} procurement request{procurements.length === 1 ? '' : 's'}
              </span>
            </div>
          </>
        ) : (
          <div className="empty-state-card" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon-wrapper">
              <ProcurementIcon size={26} className="text-blue-500" />
            </div>
            <h4 className="empty-state-title">0 Procurement Records</h4>
            <p className="empty-state-desc">
              Start adding procurement records for {currentUser?.companyName} to activate intelligence and live benchmarks.
            </p>
            <button
              type="button"
              className="btn-login-submit"
              style={{ maxWidth: '220px', marginTop: '12px' }}
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon size={16} />
              <span>Add Procurement</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Requisition Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Procurement Requisition</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Item / Request Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 50 Developer Laptops, Lab Test Equipments"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. IT, R&D, Design"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Amount (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 500000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Vendor Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CompEdge Systems"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="IT">IT Hardware</option>
                    <option value="Software">Software & SaaS</option>
                    <option value="Operations">Operations & Workplace</option>
                    <option value="Travel">Travel & Logistics</option>
                    <option value="Engineering Equipment">Engineering Equipment</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-register-back"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-login-submit">
                  <PlusIcon size={16} />
                  <span>Create Requisition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
