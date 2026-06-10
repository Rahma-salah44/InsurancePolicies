import React from 'react';
import styles from './UI.module.css';

/* ── Badge ── */
export function Badge({ variant, children }) {
  return <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>{children}</span>;
}

/* ── Button ── */
export function Button({ variant = 'default', size = 'md', icon, children, onClick, stopPropagation, disabled }) {
  const handleClick = (e) => {
    if (disabled) return;
    if (stopPropagation) e.stopPropagation();
    if (onClick) onClick(e);
  };
  return (
    <button
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <i className={`ti ${icon}`} aria-hidden="true" />}
      {children}
    </button>
  );
}

/* ── Card ── */
export function Card({ children }) {
  return <div className={styles.card}>{children}</div>;
}

/* ── SearchBar ── */
export function SearchBar({ placeholder, value, onChange, children }) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrap}>
        <i className="ti ti-search" aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="text"
          placeholder={placeholder}
          value={value !== undefined ? value : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      </div>
      {children}
    </div>
  );
}

/* ── FilterButton ── */
export function FilterButton({ label }) {
  return (
    <button className={styles.filterBtn}>
      <i className="ti ti-filter" aria-hidden="true" />
      {label}
    </button>
  );
}

/* ── BackButton ── */
export function BackButton({ label, onClick }) {
  return (
    <button className={styles.backBtn} onClick={onClick}>
      <i className="ti ti-arrow-left" aria-hidden="true" />
      {label}
    </button>
  );
}

/* ── ClientAvatar ── */
export function Avatar({ initials, color }) {
  const colorMap = {
    blue:  { background: '#e6f1fb', color: '#185fa5' },
    pink:  { background: '#fbeaf0', color: '#993556' },
    green: { background: '#eaf3de', color: '#3b6d11' },
  };
  const style = colorMap[color] || colorMap.blue;
  return (
    <div className={styles.avatar} style={style}>
      {initials}
    </div>
  );
}
