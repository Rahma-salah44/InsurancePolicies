import React from 'react';
import styles from './Topbar.module.css';

const pageTitles = {
  dashboard:       'Dashboard',
  clients:         'Clients',
  policies:        'Policies',
  claims:          'Claims',
  'client-detail': 'Client Detail',
  'policy-detail': 'Policy Detail',
};

export default function Topbar({ activePage, onLogout }) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{pageTitles[activePage] || activePage}</h1>
      <div className={styles.right}>
        {onLogout && (
          <button className={styles.logoutBtn} onClick={onLogout} title="Sign out">
            <i className="ti ti-logout" aria-hidden="true" />
          </button>
        )}
        <div className={styles.avatar} title="Agent">A</div>
      </div>
    </header>
  );
}
