// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  BrainSparkleLogo,
  SparklesIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '../components/icons/Icons';
import { useAuth } from '../context/useAuth';

export default function Register({ onNavigateToLogin, onRegistrationSuccess }) {
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State across 3 Steps
  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: Company
    companyName: '',
    jobRole: '',
    department: '',
    companyDescription: '',

    // Step 3: Work Context
    companyWork: '',
    procurementTypes: '',
    workDescription: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.username.trim()) return 'Username is required.';
    if (formData.username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!formData.email.trim()) return 'Office Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return 'Please enter a valid office email address.';
    }
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const validateStep2 = () => {
    if (!formData.companyName.trim()) return 'Company Name is required.';
    if (!formData.jobRole.trim()) return 'Job Role is required.';
    if (!formData.department.trim()) return 'Department is required.';
    if (!formData.companyDescription.trim()) return 'Please provide a brief company description.';
    return null;
  };

  const validateStep3 = () => {
    if (!formData.companyWork.trim()) return 'Please describe what your company does.';
    if (!formData.procurementTypes.trim()) return 'Please select or specify procurement types.';
    if (!formData.workDescription.trim()) return 'Please specify what you are responsible for.';
    return null;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setError(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);

    const result = register({
      fullName: formData.fullName,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      companyName: formData.companyName,
      jobRole: formData.jobRole,
      department: formData.department,
      companyDescription: `${formData.companyDescription}. ${formData.companyWork}`.trim(),
      workDescription: formData.workDescription,
      procurementTypes: formData.procurementTypes,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Success! New account created with completely empty dataset
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }
  };

  return (
    <div className="login-page-container">
      {/* Subtle Background Glows */}
      <div className="login-ambient-orb orb-primary" />
      <div className="login-ambient-orb orb-secondary" />
      <div className="login-ambient-grid" />

      <div className="login-card-wrapper register-card-wrapper">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-logo">
            <BrainSparkleLogo size={40} />
          </div>
          <div className="login-brand-title-row">
            <h1 className="login-brand-title">ProcureMind</h1>
            <span className="login-brand-badge">AI</span>
          </div>
          <p className="login-brand-subtitle">Create Your Enterprise Account</p>
        </div>

        {/* Step Indicator */}
        <div className="register-steps-indicator">
          <div className={`step-pill ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-name">Account</span>
          </div>
          <div className="step-connector" />
          <div className={`step-pill ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-name">Company</span>
          </div>
          <div className="step-connector" />
          <div className={`step-pill ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-name">Context</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert" role="alert">
            <ShieldAlertIcon size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Multi-Step Form */}
        <form onSubmit={step === 3 ? handleSubmit : handleNextStep} className="login-form">
          {/* STEP 1: ACCOUNT */}
          {step === 1 && (
            <div className="step-fields-group">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. rahul_procure"
                    value={formData.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Office Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COMPANY */}
          {step === 2 && (
            <div className="step-fields-group">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apex Global Technologies"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Job Role</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Head of Procurement"
                    value={formData.jobRole}
                    onChange={(e) => updateField('jobRole', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sourcing & Supply Chain"
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  placeholder="e.g. Enterprise software and industrial electronics manufacturer..."
                  value={formData.companyDescription}
                  onChange={(e) => updateField('companyDescription', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3: WORK CONTEXT */}
          {step === 3 && (
            <div className="step-fields-group">
              <div className="form-group">
                <label className="form-label">What does your company do?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Builds embedded IoT sensors and enterprise edge devices"
                  value={formData.companyWork}
                  onChange={(e) => updateField('companyWork', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">What type of procurement does your organization handle?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Developer Laptops, Lab Multimeters, AWS Cloud, Adobe SaaS"
                  value={formData.procurementTypes}
                  onChange={(e) => updateField('procurementTypes', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">What are you responsible for?</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  placeholder="e.g. Supplier pricing negotiations, hardware purchase orders, and SaaS renewals..."
                  value={formData.workDescription}
                  onChange={(e) => updateField('workDescription', e.target.value)}
                  required
                />
              </div>

              <div className="register-ai-notice">
                <SparklesIcon size={14} className="text-blue-500" />
                <span>
                  This context will configure your personalized AI procurement engine.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="register-actions-row">
            {step > 1 && (
              <button
                type="button"
                className="btn-register-back"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button type="submit" className="btn-login-submit">
                <span>Continue to Step {step + 1}</span>
                <ChevronRightIcon size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading-state">
                    <span className="login-spinner" /> Initializing Account...
                  </span>
                ) : (
                  <>
                    <CheckCircleIcon size={16} />
                    <span>Create Enterprise Account</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer Back to Login Link */}
        <div className="register-footer-row">
          <span>Already have an account?</span>
          <button
            type="button"
            className="btn-link-login"
            onClick={onNavigateToLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
