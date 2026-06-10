import React, { useEffect, useState } from 'react';
import { Card, SearchBar, Button, Badge } from '../components/UI';
import { Table, Tr, Td } from '../components/Table';
import Modal, { FormField, FormInput } from '../components/Modal';
import { clientsApi } from '../services/clients';
import { formatDate, getInitials, getAvatarColor, toDateInput } from '../services/enums';
import styles from './Clients.module.css';

const emptyForm = { fullName: '', email: '', phone: '', nationalId: '', dateOfBirth: '' };

export default function Clients({ onNavigate }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    clientsApi.getAll()
      .then(data => setClients(data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || c.fullName.toLowerCase().includes(q) || c.nationalId.includes(q) || c.email.toLowerCase().includes(q);
  });

  const setField = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setModal('create');
  };

  const openEdit = (c) => {
    setEditTarget(c);
    setForm({
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      nationalId: c.nationalId,
      dateOfBirth: toDateInput(c.dateOfBirth),
    });
    setFormError('');
    setModal('edit');
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.nationalId.trim() || !form.dateOfBirth) {
      setFormError('Full name, email, national ID and date of birth are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const dto = { ...form };
      if (modal === 'create') {
        await clientsApi.create(dto);
      } else {
        await clientsApi.update(editTarget.id, dto);
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
      await clientsApi.delete(deleteTarget.id);
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
      <SearchBar placeholder="Search clients by name or national ID…" value={search} onChange={setSearch}>
        <Button variant="primary" size="sm" icon="ti-plus" onClick={openCreate}>New client</Button>
      </SearchBar>

      <Card>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No clients found</div>
        ) : (
          <Table columns={['Client', 'Phone', 'National ID', 'Date of birth', 'Actions']}>
            {filtered.map(c => {
              const avatarStyle = getAvatarColor(c.id);
              return (
                <Tr key={c.id}>
                  <Td>
                    <div className={styles.clientCell} onClick={() => onNavigate('client-detail', { id: c.id })} style={{ cursor: 'pointer' }}>
                      <div className={styles.avatar} style={avatarStyle}>{getInitials(c.fullName)}</div>
                      <div>
                        <div className={styles.clientName}>{c.fullName}</div>
                        <div className={styles.clientMeta}>{c.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{c.phone}</Td>
                  <Td mono>{c.nationalId}</Td>
                  <Td>{formatDate(c.dateOfBirth)}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Button size="sm" icon="ti-eye"   onClick={() => onNavigate('client-detail', { id: c.id })}>View</Button>
                      <Button size="sm" icon="ti-edit"  onClick={() => openEdit(c)}>Edit</Button>
                      <Button size="sm" icon="ti-trash" variant="reject" onClick={() => setDeleteTarget(c)} />
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </Table>
        )}
      </Card>

      {/* Create / Edit modal */}
      {modal && (
        <Modal
          title={modal === 'create' ? 'New client' : 'Edit client'}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          submitLabel={modal === 'create' ? 'Create' : 'Save'}
          loading={saving}
        >
          {formError && <div className={styles.formError}>{formError}</div>}
          <FormField label="Full name *"><FormInput value={form.fullName}   onChange={setField('fullName')}   placeholder="Ahmed Al-Rashidi" /></FormField>
          <FormField label="Email *">    <FormInput value={form.email}      onChange={setField('email')}      placeholder="name@example.com" type="email" /></FormField>
          <FormField label="Phone">      <FormInput value={form.phone}      onChange={setField('phone')}      placeholder="+966 501 234 567" /></FormField>
          <FormField label="National ID *"><FormInput value={form.nationalId} onChange={setField('nationalId')} placeholder="1098765432" /></FormField>
          <FormField label="Date of birth *"><FormInput value={form.dateOfBirth} onChange={setField('dateOfBirth')} type="date" /></FormField>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal
          title="Delete client"
          onClose={() => setDeleteTarget(null)}
          onSubmit={handleDelete}
          submitLabel="Delete"
          loading={deleting}
        >
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Are you sure you want to delete <strong>{deleteTarget.fullName}</strong>? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}
