import React, { useEffect, useState } from 'react';
import { Card, SearchBar, Button, Badge } from '../components/UI';
import { Table, Tr, Td } from '../components/Table';
import Modal, { FormField, FormInput } from '../components/Modal';
import { policiesApi } from '../services/policies';
import { clientsApi } from '../services/clients';
import {
  mapPolicyType, mapPolicyStatus, capitalize, formatDate,
  POLICY_TYPE_OPTIONS, POLICY_STATUS_OPTIONS,
} from '../services/enums';
import styles from './Clients.module.css'; // reuse generic page styles

export default function Policies({ onNavigate }) {
  const [policies, setPolicies] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ policyNumber: '', type: '', status: '', startDate: '', endDate: '', clientId: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([policiesApi.getAll(), clientsApi.getAll()])
      .then(([p, c]) => { setPolicies(p || []); setClients(c || []); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = policies.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.policyNumber.toLowerCase().includes(q) ||
      (p.clientName || '').toLowerCase().includes(q);
    const matchStatus = !statusFilter || mapPolicyStatus(p.status) === statusFilter;
    const matchType   = !typeFilter   || mapPolicyType(p.type)     === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const setField = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const openCreate = () => {
    setForm({ policyNumber: '', type: '', status: '', startDate: '', endDate: '', clientId: '' });
    setFormError('');
    setModal('create');
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({
      policyNumber: p.policyNumber,
      type: String(typeof p.type === 'number' ? p.type : POLICY_TYPE_OPTIONS.findIndex(o => o.label.toLowerCase() === mapPolicyType(p.type))),
      status: String(typeof p.status === 'number' ? p.status : POLICY_STATUS_OPTIONS.findIndex(o => o.label.toLowerCase() === mapPolicyStatus(p.status))),
      startDate: p.startDate ? p.startDate.split('T')[0] : '',
      endDate: p.endDate ? p.endDate.split('T')[0] : '',
      clientId: String(p.clientId),
    });
    setFormError('');
    setModal('edit');
  };

  const handleSubmit = async () => {
    if (!form.policyNumber.trim() || form.type === '' || !form.startDate || !form.endDate) {
      setFormError('Policy number, type, start and end dates are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (modal === 'create') {
        if (!form.clientId) { setFormError('Please select a client.'); setSaving(false); return; }
        await policiesApi.create({
          policyNumber: form.policyNumber,
          type: Number(form.type),
          startDate: form.startDate,
          endDate: form.endDate,
          clientId: Number(form.clientId),
        });
      } else {
        await policiesApi.update(editTarget.id, {
          policyNumber: form.policyNumber,
          type: Number(form.type),
          status: Number(form.status),
          startDate: form.startDate,
          endDate: form.endDate,
        });
      }
      setModal(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await policiesApi.delete(deleteTarget.id);
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
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', fontSize: 16, pointerEvents: 'none' }} />
          <input
            style={{ width: '100%', padding: '8px 12px 8px 34px', border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            placeholder="Search by policy number or client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select style={selectStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {POLICY_STATUS_OPTIONS.map(o => <option key={o.value} value={o.label.toLowerCase()}>{o.label}</option>)}
        </select>
        <select style={selectStyle} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          {POLICY_TYPE_OPTIONS.map(o => <option key={o.value} value={o.label.toLowerCase()}>{o.label}</option>)}
        </select>
        <Button variant="primary" size="sm" icon="ti-plus" onClick={openCreate}>New policy</Button>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No policies found</div>
        ) : (
          <Table columns={['Policy #', 'Client', 'Type', 'Status', 'Start', 'End', '']}>
            {filtered.map(p => (
              <Tr key={p.id} onClick={() => onNavigate('policy-detail', { id: p.id })}>
                <Td mono>{p.policyNumber}</Td>
                <Td>{p.clientName || `Client #${p.clientId}`}</Td>
                <Td><Badge variant={mapPolicyType(p.type)}>{capitalize(mapPolicyType(p.type))}</Badge></Td>
                <Td><Badge variant={mapPolicyStatus(p.status)}>{capitalize(mapPolicyStatus(p.status))}</Badge></Td>
                <Td small>{formatDate(p.startDate)}</Td>
                <Td small>{formatDate(p.endDate)}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button size="sm" icon="ti-edit"  stopPropagation onClick={() => openEdit(p)} />
                    <Button size="sm" icon="ti-trash" variant="reject" stopPropagation onClick={() => setDeleteTarget(p)} />
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Create / Edit modal */}
      {modal && (
        <Modal
          title={modal === 'create' ? 'New policy' : 'Edit policy'}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          submitLabel={modal === 'create' ? 'Create' : 'Save'}
          loading={saving}
        >
          {formError && <div className={styles.formError}>{formError}</div>}
          <FormField label="Policy number *"><FormInput value={form.policyNumber} onChange={setField('policyNumber')} placeholder="POL-2024-0001" /></FormField>
          <FormField label="Type *">
            <select style={modalSelectStyle} value={form.type} onChange={e => setField('type')(e.target.value)}>
              <option value="">Select type…</option>
              {POLICY_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          {modal === 'edit' && (
            <FormField label="Status *">
              <select style={modalSelectStyle} value={form.status} onChange={e => setField('status')(e.target.value)}>
                <option value="">Select status…</option>
                {POLICY_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </FormField>
          )}
          {modal === 'create' && (
            <FormField label="Client *">
              <select style={modalSelectStyle} value={form.clientId} onChange={e => setField('clientId')(e.target.value)}>
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
              </select>
            </FormField>
          )}
          <FormField label="Start date *"><FormInput value={form.startDate} onChange={setField('startDate')} type="date" /></FormField>
          <FormField label="End date *">  <FormInput value={form.endDate}   onChange={setField('endDate')}   type="date" /></FormField>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal title="Delete policy" onClose={() => setDeleteTarget(null)} onSubmit={handleDelete} submitLabel="Delete" loading={deleting}>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Are you sure you want to delete policy <strong>{deleteTarget.policyNumber}</strong>?
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
