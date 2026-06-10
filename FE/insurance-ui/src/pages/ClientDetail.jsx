import React, { useEffect, useState } from 'react';
import { BackButton, Button, Badge, Card } from '../components/UI';
import { Table, Tr, Td } from '../components/Table';
import Modal, { FormField, FormInput } from '../components/Modal';
import { clientsApi } from '../services/clients';
import { policiesApi } from '../services/policies';
import {
  formatDate, getInitials, getAvatarColor, toDateInput,
  mapPolicyType, mapPolicyStatus, capitalize, POLICY_TYPE_OPTIONS,
} from '../services/enums';
import styles from './ClientDetail.module.css';

const emptyClientForm = { fullName: '', email: '', phone: '', nationalId: '', dateOfBirth: '' };
const emptyPolicyForm = { policyNumber: '', type: '', startDate: '', endDate: '' };

export default function ClientDetail({ clientId, onNavigate }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState(emptyClientForm);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const [policyModal, setPolicyModal] = useState(false);
  const [policyForm, setPolicyForm] = useState(emptyPolicyForm);
  const [policyError, setPolicyError] = useState('');
  const [policyLoading, setPolicyLoading] = useState(false);

  const load = () => {
    if (!clientId) { setError('No client selected.'); setLoading(false); return; }
    setLoading(true);
    clientsApi.getByIdWithPolicies(clientId)
      .then(data => setClient(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [clientId]);

  const setEField = (key) => (val) => setEditForm(f => ({ ...f, [key]: val }));
  const setPField = (key) => (val) => setPolicyForm(f => ({ ...f, [key]: val }));

  const openEdit = () => {
    setEditForm({
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      nationalId: client.nationalId,
      dateOfBirth: toDateInput(client.dateOfBirth),
    });
    setEditError('');
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      setEditError('Full name and email are required.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      await clientsApi.update(clientId, editForm);
      setEditModal(false);
      load();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openNewPolicy = () => {
    setPolicyForm(emptyPolicyForm);
    setPolicyError('');
    setPolicyModal(true);
  };

  const handlePolicySubmit = async () => {
    if (!policyForm.policyNumber.trim() || policyForm.type === '' || !policyForm.startDate || !policyForm.endDate) {
      setPolicyError('All fields are required.');
      return;
    }
    setPolicyLoading(true);
    setPolicyError('');
    try {
      await policiesApi.create({
        policyNumber: policyForm.policyNumber,
        type: Number(policyForm.type),
        startDate: policyForm.startDate,
        endDate: policyForm.endDate,
        clientId,
      });
      setPolicyModal(false);
      load();
    } catch (err) {
      setPolicyError(err.message);
    } finally {
      setPolicyLoading(false);
    }
  };

  if (loading) return <div className={styles.centered}><i className="ti ti-loader-2 ti-spin" style={{ fontSize: 24, color: 'var(--color-text-tertiary)' }} /></div>;
  if (error)   return <div className={styles.errorBox}><i className="ti ti-alert-circle" /><span>{error}</span><Button size="sm" onClick={() => onNavigate('clients')}>Back</Button></div>;
  if (!client) return null;

  const policies = client.policies || [];
  const activePolicies = policies.filter(p => mapPolicyStatus(p.status) === 'active');
  const avatarStyle = getAvatarColor(client.id);

  return (
    <div>
      <BackButton label="Back to clients" onClick={() => onNavigate('clients')} />

      {/* Header */}
      <div className={styles.detailHeader}>
        <div className={styles.clientInfo}>
          <div className={styles.avatar} style={avatarStyle}>{getInitials(client.fullName)}</div>
          <div>
            <div className={styles.clientName}>{client.fullName}</div>
            <div className={styles.clientMeta}>{client.email} · {client.phone}</div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button size="sm" icon="ti-edit" onClick={openEdit}>Edit</Button>
          <Button variant="primary" size="sm" icon="ti-plus" onClick={openNewPolicy}>New policy</Button>
        </div>
      </div>

      {/* Detail grid */}
      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailCardTitle}>
            <i className="ti ti-id-badge" aria-hidden="true" />
            Personal info
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>National ID</span>
            <span className={styles.fieldValueMono}>{client.nationalId}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Date of birth</span>
            <span className={styles.fieldValue}>{formatDate(client.dateOfBirth)}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Phone</span>
            <span className={styles.fieldValue}>{client.phone || '—'}</span>
          </div>
          {client.createdBy && (
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Created by</span>
              <span className={styles.fieldValue}>{client.createdBy}</span>
            </div>
          )}
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardTitle}>
            <i className="ti ti-chart-pie" aria-hidden="true" />
            Summary
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Active policies</span>
            <span className={styles.fieldValue} style={{ color: '#3b6d11' }}>{activePolicies.length}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Total policies</span>
            <span className={styles.fieldValue}>{policies.length}</span>
          </div>
        </div>
      </div>

      {/* Policies table */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Policies</span>
      </div>
      <Card>
        {policies.length === 0 ? (
          <div className={styles.empty}>No policies for this client</div>
        ) : (
          <Table columns={['Policy #', 'Type', 'Status', 'Start', 'End']}>
            {policies.map(p => (
              <Tr key={p.id} onClick={() => onNavigate('policy-detail', { id: p.id })}>
                <Td mono>{p.policyNumber}</Td>
                <Td><Badge variant={mapPolicyType(p.type)}>{capitalize(mapPolicyType(p.type))}</Badge></Td>
                <Td><Badge variant={mapPolicyStatus(p.status)}>{capitalize(mapPolicyStatus(p.status))}</Badge></Td>
                <Td>{formatDate(p.startDate)}</Td>
                <Td>{formatDate(p.endDate)}</Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Edit client modal */}
      {editModal && (
        <Modal title="Edit client" onClose={() => setEditModal(false)} onSubmit={handleEditSubmit} loading={saving}>
          {editError && <div className={styles.formError}>{editError}</div>}
          <FormField label="Full name *"><FormInput value={editForm.fullName}   onChange={setEField('fullName')}   placeholder="Ahmed Al-Rashidi" /></FormField>
          <FormField label="Email *">    <FormInput value={editForm.email}      onChange={setEField('email')}      placeholder="name@example.com" type="email" /></FormField>
          <FormField label="Phone">      <FormInput value={editForm.phone}      onChange={setEField('phone')}      placeholder="+966 501 234 567" /></FormField>
          <FormField label="National ID *"><FormInput value={editForm.nationalId} onChange={setEField('nationalId')} placeholder="1098765432" /></FormField>
          <FormField label="Date of birth *"><FormInput value={editForm.dateOfBirth} onChange={setEField('dateOfBirth')} type="date" /></FormField>
        </Modal>
      )}

      {/* New policy modal */}
      {policyModal && (
        <Modal title="New policy" onClose={() => setPolicyModal(false)} onSubmit={handlePolicySubmit} submitLabel="Create" loading={policyLoading}>
          {policyError && <div className={styles.formError}>{policyError}</div>}
          <FormField label="Policy number *"><FormInput value={policyForm.policyNumber} onChange={setPField('policyNumber')} placeholder="POL-2024-0001" /></FormField>
          <FormField label="Type *">
            <select className={styles.select} value={policyForm.type} onChange={e => setPField('type')(e.target.value)} required>
              <option value="">Select type…</option>
              {POLICY_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label="Start date *"><FormInput value={policyForm.startDate} onChange={setPField('startDate')} type="date" /></FormField>
          <FormField label="End date *">  <FormInput value={policyForm.endDate}   onChange={setPField('endDate')}   type="date" /></FormField>
        </Modal>
      )}
    </div>
  );
}
