import React from 'react';
import styles from './Sidebar.module.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard', section: 'Overview' },
  { id: 'clients',   label: 'Clients',   icon: 'ti-users',             section: 'Records' },
  { id: 'policies',  label: 'Policies',  icon: 'ti-file-text' },
  { id: 'claims',    label: 'Claims',    icon: 'ti-clipboard-list' },
];

export default function Sidebar({ activePage, onNavigate }) {
  let lastSection = null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoText}>
          <i className="ti ti-shield-check" aria-hidden="true" />
          Insurance Policies
        </div>
        <div className={styles.logoSub}>Policy Management</div>
      </div>

      <nav>
        {navItems.map(item => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          return (
            <React.Fragment key={item.id}>
              {showSection && <span className={styles.navSection}>{item.section}</span>}
              <button
                className={`${styles.navItem} ${activePage === item.id ? styles.active : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" />
                {item.label}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
