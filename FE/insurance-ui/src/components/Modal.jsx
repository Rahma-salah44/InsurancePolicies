import React from 'react';
import styles from './Modal.module.css';

export default function Modal({ title, onClose, onSubmit, submitLabel = 'Save', loading, children }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={loading}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className={styles.submitBtn} onClick={onSubmit} disabled={loading}>
            {loading ? <i className="ti ti-loader-2 ti-spin" aria-hidden="true" /> : null}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FormField({ label, children, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

export function FormInput({ value, onChange, type = 'text', placeholder, required }) {
  return (
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  );
}

export function FormSelect({ value, onChange, options, required }) {
  return (
    <select
      className={styles.input}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
    >
      <option value="">Select…</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
