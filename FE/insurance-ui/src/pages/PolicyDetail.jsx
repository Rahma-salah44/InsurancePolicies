import React, { useEffect, useState } from 'react';
import { BackButton, Button, Badge, Card } from '../components/UI';
import { Table, Tr, Td } from '../components/Table';
import Modal, { FormField, FormInput } from '../components/Modal';
import { policiesApi } from '../services/policies';
import { claimsApi } from '../services/claims';
import {
  mapPolicyType, mapPolicyStatus, mapClaimStatus, capitalize, formatDate,
  POLICY_STATUS_OPTIONS, CLAIM_STATUS_OPTIONS,
} from '../services/enums';
import styles from './ClientDetail.module.css';

export default function PolicyDetail({ policyId, onNavigate }) {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit status modal
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState('');

  // File claim modal
  const [claimModal, setClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({ claimNumber: '', description: '' });
  const [claimError, setClaimError] = useState('');
  const [claimSaving, setClaimSaving] = useState(false);

  // Claim action (approve / reject)
  const [actionLoading, setActionLoading] = useState(null);

  const load = () => {
    if (!policyId) { setError('No policy selected.'); setLoading(false); return; }
    setLoading(true);
    policiesApi.getByIdWithClaims(policyId)
      .then(data => setPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [policyId]);

  const handleStatusSave = async () => {
    if (newStatus === '') { setStatusError('Please select a status.'); return; }
    setStatusSaving(true);
    setStatusError('');
    try {
      await policiesApi.update(policyId, {
        policyNumber: policy.policyNumber,
        type: typeof policy.type === 'number' ? policy.type : POLICY_STATUS_OPTIONS.findIndex(o => o.label.toLowerCase() === mapPolicyType(policy.type)),
        status: Number(newStatus),
        startDate: policy.startDate,
        endDate: policy.endDate,
      });
      setStatusModal(false);
      load();
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setStatusSaving(false);
    }
  };

  const handleFileClaim = async () => {
    if (!claimForm.claimNumber.trim() || !claimForm.description.trim()) {
      setClaimError('Claim number and description are required.');
      return;
    }
    setClaimSaving(true);
    setClaimError('');
    try {
      await claimsApi.create({ claimNumber: claimForm.claimNumber, description: claimForm.description, policyId });
      setClaimModal(false);
      setClaimForm({ claimNumber: '', description: '' });
      load();
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimSaving(false);
    }
  };

  const handleClaimStatus = async (claimId, status) => {
    setActionLoading(claimId);
    try {
      await claimsApi.updateStatus(claimId, status);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className={styles.centered}><i className="ti ti-loader-2 ti-spin" style={{ fontSize: 24, color: 'var(--color-text-tertiary)' }} /></div>;
  if (error)   return <div className={styles.errorBox}><i className="ti ti-alert-circle" /><span>{error}</span><Button size="sm" onClick={() => onNavigate('policies')}>Back</Button></div>;
  if (!policy) return null;

  const typeStr   = mapPolicyType(policy.type);
  const statusStr = mapPolicyStatus(policy.status);
  const claims    = policy.claims || [];

  return (
    <div>
      <BackButton label="Back to policies" onClick={() => onNavigate('policies')} />

      {/* Header */}
      <div className={styles.detailHeader}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{policy.policyNumber}</span>
            <Badge variant={statusStr}>{capitalize(statusStr)}</Badge>
            <Badge variant={typeStr}>{capitalize(typeStr)}</Badge>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {policy.clientName || `Client #${policy.clientId}`}
          </div>
        </div>
        <div className={styles.actions}>
          <Button size="sm" icon="ti-edit" onClick={() => { setNewStatus(''); setStatusError(''); setStatusModal(true); }}>Edit status</Button>
          <Button variant="primary" size="sm" icon="ti-plus" onClick={() => { setClaimForm({ claimNumber: '', description: '' }); setClaimError(''); setClaimModal(true); }}>File claim</Button>
        </div>
      </div>

      {/* Detail grid */}
      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailCardTitle}>
            <i className="ti ti-file-description" aria-hidden="true" />
            Policy details
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Policy number</span>
            <span className={styles.fieldValueMono}>{policy.policyNumber}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Start date</span>
            <span className={styles.fieldValue}>{formatDate(policy.startDate)}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>End date</span>
            <span className={styles.fieldValue}>{formatDate(policy.endDate)}</span>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardTitle}>
            <i className="ti ti-user" aria-hidden="true" />
            Client
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Name</span>
            <span className={styles.fieldValue}>{policy.clientName || `#${policy.clientId}`}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Client ID</span>
            <span className={styles.fieldValueMono}>{policy.clientId}</span>
          </div>
        </div>
      </div>

      {/* Claims table */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Claims on this policy</span>
        <Button variant="primary" size="sm" icon="ti-plus" onClick={() => { setClaimForm({ claimNumber: '', description: '' }); setClaimError(''); setClaimModal(true); }}>File claim</Button>
      </div>
      <Card>
        {claims.length === 0 ? (
          <div className={styles.empty}>No claims on this policy</div>
        ) : (
          <Table columns={['Claim #', 'Description', 'Filed', 'Status', 'Actions']}>
            {claims.map(cl => {
              const clStatusStr = mapClaimStatus(cl.status);
              return (
                <Tr key={cl.id}>
                  <Td mono>{cl.claimNumber}</Td>
                  <Td muted small style={{ maxWidth: 200 }}>{cl.description}</Td>
                  <Td small>{formatDate(cl.createdAt)}</Td>
                  <Td><Badge variant={clStatusStr}>{capitalize(clStatusStr)}</Badge></Td>
                  <Td>
                    {clStatusStr === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="approve" size="sm" icon="ti-check"
                          onClick={() => handleClaimStatus(cl.id, 1)}
                          disabled={actionLoading === cl.id}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="reject" size="sm" icon="ti-x"
                          onClick={() => handleClaimStatus(cl.id, 2)}
                          disabled={actionLoading === cl.id}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Table>
        )}
      </Card>

      {/* Edit status modal */}
      {statusModal && (
        <Modal title="Edit policy status" onClose={() => setStatusModal(false)} onSubmit={handleStatusSave} loading={statusSaving}>
          {statusError && <div className={styles.formError}>{statusError}</div>}
          <FormField label="New status *">
            <select style={selectStyle} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="">Select status…</option>
              {POLICY_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
        </Modal>
      )}

      {/* File claim modal */}
      {claimModal && (
        <Modal title="File new claim" onClose={() => setClaimModal(false)} onSubmit={handleFileClaim} submitLabel="File claim" loading={claimSaving}>
          {claimError && <div className={styles.formError}>{claimError}</div>}
          <FormField label="Claim number *">
            <FormInput value={claimForm.claimNumber} onChange={v => setClaimForm(f => ({ ...f, claimNumber: v }))} placeholder="CLM-2024-001" />
          </FormField>
          <FormField label="Description *">
            <textarea
              style={{ ...selectStyle, resize: 'vertical', minHeight: 80 }}
              value={claimForm.description}
              onChange={e => setClaimForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the claim…"
            />
          </FormField>
        </Modal>
      )}
    </div>
  );
}

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '0.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 13,
  color: 'var(--color-text-primary)',
  background: 'var(--color-bg-primary)',
  fontFamily: 'inherit',
  outline: 'none',
};
