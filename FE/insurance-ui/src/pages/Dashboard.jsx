import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { Table, Tr, Td } from '../components/Table';
import { clientsApi } from '../services/clients';
import { policiesApi } from '../services/policies';
import { claimsApi } from '../services/claims';
import { mapClaimStatus, mapPolicyStatus, formatDate, getInitials, getAvatarColor } from '../services/enums';
import styles from './Dashboard.module.css';

export default function Dashboard({ onNavigate }) {
  const [clients, setClients] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([clientsApi.getAll(), policiesApi.getAll(), claimsApi.getAll()])
      .then(([c, p, cl]) => {
        setClients(c || []);
        setPolicies(p || []);
        setClaims(cl || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.centered}>
        <i className="ti ti-loader-2 ti-spin" style={{ fontSize: 24, color: 'var(--color-text-tertiary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorBox}>
        <i className="ti ti-alert-circle" />
        <span>{error}</span>
      </div>
    );
  }

  const activeCount  = policies.filter(p => mapPolicyStatus(p.status) === 'active').length;
  const pendingClaims = claims.filter(cl => mapClaimStatus(cl.status) === 'pending');
  const recentClients = [...clients].slice(0, 5);

  return (
    <div>
      {/* Metrics */}
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}><i className="ti ti-users" aria-hidden="true" />Clients</div>
          <div className={styles.metricValue}>{clients.length}</div>
          <div className={styles.metricSub}>Total registered</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}><i className="ti ti-file-text" aria-hidden="true" />Policies</div>
          <div className={styles.metricValue}>{policies.length}</div>
          <div className={styles.metricSub}>{activeCount} active</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}><i className="ti ti-clipboard-list" aria-hidden="true" />Claims</div>
          <div className={styles.metricValue}>{claims.length}</div>
          <div className={styles.metricSub}>{pendingClaims.length} pending review</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}><i className="ti ti-coin" aria-hidden="true" />Pending</div>
          <div className={styles.metricValue}>{pendingClaims.length}</div>
          <div className={styles.metricSub}>Claims awaiting review</div>
        </div>
      </div>

      {/* Pending claims */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Pending claims</span>
        <Button size="sm" onClick={() => onNavigate('claims')}>View all</Button>
      </div>
      <Card>
        {pendingClaims.length === 0 ? (
          <div className={styles.empty}>No pending claims</div>
        ) : (
          <Table columns={['Claim #', 'Policy', 'Description', 'Filed', 'Status']}>
            {pendingClaims.slice(0, 5).map(cl => (
              <Tr key={cl.id}>
                <Td mono>{cl.claimNumber}</Td>
                <Td mono small>{cl.policyNumber || cl.policyId}</Td>
                <Td muted small style={{ maxWidth: 180 }}>{cl.description}</Td>
                <Td small>{formatDate(cl.createdAt)}</Td>
                <Td><Badge variant="pending">Pending</Badge></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Recent clients */}
      <div className={styles.sectionHeader} style={{ marginTop: 4 }}>
        <span className={styles.sectionTitle}>Recent clients</span>
        <Button size="sm" onClick={() => onNavigate('clients')}>View all</Button>
      </div>
      <Card>
        {recentClients.length === 0 ? (
          <div className={styles.empty}>No clients yet</div>
        ) : (
          <Table columns={['Client', 'National ID', 'Date of birth']}>
            {recentClients.map(c => {
              const avatarStyle = getAvatarColor(c.id);
              return (
                <Tr key={c.id} onClick={() => onNavigate('client-detail', { id: c.id })}>
                  <Td>
                    <div className={styles.clientCell}>
                      <div className={styles.avatarBlue} style={avatarStyle}>
                        {getInitials(c.fullName)}
                      </div>
                      <div>
                        <div className={styles.clientName}>{c.fullName}</div>
                        <div className={styles.clientMeta}>{c.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td mono>{c.nationalId}</Td>
                  <Td>{formatDate(c.dateOfBirth)}</Td>
                </Tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
}
