import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/msalConfig';
import styles from './Login.module.css';

export default function Login() {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgShape1} />
        <div className={styles.bgShape2} />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M11 2L3 6.5V15.5L11 20L19 15.5V6.5L11 2Z" fill="#185FA5" fillOpacity="0.12" stroke="#185FA5" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M11 6L7 8.5V13.5L11 16L15 13.5V8.5L11 6Z" fill="#185FA5"/>
            </svg>
          </div>
          <span className={styles.logoName}>Insurance Policies</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.headline}>Sign in to Policy Manager</div>
        <p className={styles.sub}>
          Use your organisation account to continue.
          <br />Access is managed by your IT administrator.
        </p>

        {error && <p className={styles.errorMsg}>{error}</p>}

        {/* Microsoft SSO Button */}
        <button className={styles.ssoBtn} onClick={handleMicrosoftLogin} disabled={loading}>
          {loading ? (
            <i className="ti ti-loader-2 ti-spin" style={{ fontSize: 18 }} aria-hidden="true" />
          ) : (
            <svg className={styles.msIcon} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1"  width="9" height="9" fill="#7fba00"/>
              <rect x="1"  y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
          )}
          {loading ? 'Redirecting…' : 'Continue with Microsoft'}
        </button>

        <p className={styles.help}>
          Having trouble signing in?{' '}
          <a href="#" className={styles.helpLink}>Contact IT support</a>
        </p>
      </div>

      <p className={styles.footer}>© {new Date().getFullYear()} Insurance Policies · Insurance Policy Manager</p>
    </div>
  );
}
