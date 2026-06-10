import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Table, Tr, Td } from '../components/Table';
import Modal, { FormField, FormInput } from '../components/Modal';
import { claimsApi } from '../services/claims';
import { policiesApi } from '../services/policies';
import { mapClaimStatus, capitalize, formatDate, CLAIM_STATUS_OPTIONS } from '../services/enums';
import styles from './Clients.module.css';

export default function Claims({ onNavigate }) {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [actionLoading, setActionLoading] = useState(null);

  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ claimNumber: '', description: '', policyId: '' });
  const [createError, setCreateError] = useState('');
  const [createSaving, setCreateSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([claimsApi.getAll(), policiesApi.getAll()])
      .then(([cl, p]) => { setClaims(cl || []); setPolicies(p || []); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = claims.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      c.claimNumber.toLowerCase().includes(q) ||
      (c.policyNumber || '').toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);
    const matchStatus = !statusFilter || mapClaimStatus(c.status) === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = async (claimId, status) => {
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

  const handleCreate = async () => {
    if (!createForm.claimNumber.trim() || !createForm.description.trim() || !createForm.policyId) {
      setCreateError('All fields are required.');
      return;
    }
    setCreateSaving(true);
    setCreateError('');
    try {
      await claimsApi.create({
        claimNumber: createForm.claimNumber,
        description: createForm.description,
        policyId: Number(createForm.policyId),
      });
      setCreateModal(false);
      setCreateForm({ claimNumber: '', description: '', policyId: '' });
      load();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await claimsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className={styles.centered}><i className="ti ti-loader-2 ti-spin" style={{ fontSize: 24, color: 'var(--color-text-tertiary)' }} /></div>;
  if (error)   return <div className={styles.errorBox}><i className="ti ti-alert-circle" /><span>{error}</span></div>;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', fontSize: 16, pointerEvents: 'none' }} />
          <input
            style={{ width: '100%', padding: '8px 12px 8px 34px', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            placeholder="Search by claim number or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select style={selectStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {CLAIM_STATUS_OPTIONS.map(o => <option key={o.value} value={o.label.toLowerCase()}>{o.label}</option>)}
        </select>
        <Button variant="primary" size="sm" icon="ti-plus" onClick={() => { setCreateForm({ claimNumber: '', description: '', policyId: '' }); setCreateError(''); setCreateModal(true); }}>
          New claim
        </Button>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No claims found</div>
        ) : (
          <Table columns={['Claim #', 'Policy', 'Description', 'Filed', 'Status', 'Actions']}>
            {filtered.map(c => {
              const st = mapClaimStatus(c.status);
              return (
                <Tr key={c.id}>
                  <Td mono>{c.claimNumber}</Td>
                  <Td mono small>{c.policyNumber || `#${c.policyId}`}</Td>
                  <Td muted small style={{ maxWidth: 200 }}>{c.description}</Td>
                  <Td small>{formatDate(c.createdAt)}</Td>
                  <Td><Badge variant={st}>{capitalize(st)}</Badge></Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {st === 'pending' && (
                        <>
                          <Button variant="approve" size="sm" icon="ti-check" disabled={actionLoading === c.id} onClick={() => handleAction(c.id, 1)} />
                          <Button variant="reject"  size="sm" icon="ti-x"     disabled={actionLoading === c.id} onClick={() => handleAction(c.id, 2)} />
                        </>
                      )}
                      <Button size="sm" icon="ti-trash" variant="reject" onClick={() => setDeleteTarget(c)} />
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Table>
        )}
      </Card>

      {/* Create claim modal */}
      {createModal && (
        <Modal title="New claim" onClose={() => setCreateModal(false)} onSubmit={handleCreate} submitLabel="Create" loading={createSaving}>
          {createError && <div className={styles.formError}>{createError}</div>}
          <FormField label="Claim number *">
            <FormInput value={createForm.claimNumber} onChange={v => setCreateForm(f => ({ ...f, claimNumber: v }))} placeholder="CLM-2024-001" />
          </FormField>
          <FormField label="Policy *">
            <select style={modalSelectStyle} value={createForm.policyId} onChange={e => setCreateForm(f => ({ ...f, policyId: e.target.value }))}>
              <option value="">Select policy…</option>
              {policies.map(p => <option key={p.id} value={p.id}>{p.policyNumber} – {p.clientName || `Client #${p.clientId}`}</option>)}
            </select>
          </FormField>
          <FormField label="Description *">
            <textarea
              style={{ ...modalSelectStyle, resize: 'vertical', minHeight: 80 }}
              value={createForm.description}
              onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the claim…"
            />
          </FormField>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal title="Delete claim" onClose={() => setDeleteTarget(null)} onSubmit={handleDelete} submitLabel="Delete" loading={deleting}>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Are you sure you want to delete claim <strong>{deleteTarget.claimNumber}</strong>?
          </p>
        </Modal>
      )}
    </div>
  );
}

const selectStyle = {
  padding: '7px 10px',
  border: '0.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: 12,
  color: 'var(--color-text-secondary)',
  background: 'var(--color-bg-primary)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  outline: 'none',
};

const modalSelectStyle = {
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
