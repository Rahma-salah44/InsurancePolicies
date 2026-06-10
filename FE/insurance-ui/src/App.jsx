import React, { useState } from 'react';
import { useIsAuthenticated, useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Policies from './pages/Policies';
import PolicyDetail from './pages/PolicyDetail';
import Claims from './pages/Claims';
import styles from './App.module.css';

export default function App() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [activePage, setActivePage] = useState('dashboard');
  const [navContext, setNavContext] = useState({});

  const handleNavigate = (pageId, ctx = {}) => {
    setNavContext(ctx);
    setActivePage(pageId);
  };

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
  };

  if (inProgress !== InteractionStatus.None) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <i className="ti ti-loader-2 ti-spin" style={{ fontSize: 32, color: '#185fa5' }} />
      </div>
    );
  }

  const navPage = {
    'dashboard':     'dashboard',
    'clients':       'clients',
    'client-detail': 'clients',
    'policies':      'policies',
    'policy-detail': 'policies',
    'claims':        'claims',
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <Dashboard    onNavigate={handleNavigate} />;
      case 'clients':       return <Clients      onNavigate={handleNavigate} />;
      case 'client-detail': return <ClientDetail clientId={navContext.id}  onNavigate={handleNavigate} />;
      case 'policies':      return <Policies     onNavigate={handleNavigate} />;
      case 'policy-detail': return <PolicyDetail policyId={navContext.id}  onNavigate={handleNavigate} />;
      case 'claims':        return <Claims       onNavigate={handleNavigate} />;
      default:              return null;
    }
  };

  return (
    <>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <div className={styles.shell}>
          <div className={styles.app}>
            <Sidebar activePage={navPage[activePage]} onNavigate={handleNavigate} />
            <div className={styles.main}>
              <Topbar activePage={activePage} onLogout={handleLogout} />
              <main className={styles.content}>
                {renderPage()}
              </main>
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </>
  );
}
