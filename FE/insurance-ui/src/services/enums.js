// PolicyType: Health=0, Life=1, Property=2
// PolicyStatus: Pending=0, Active=1, Expired=2, Cancelled=3
// ClaimStatus: Pending=0, Approved=1, Rejected=2

const POLICY_TYPES    = ['health', 'life', 'property'];
const POLICY_STATUSES = ['pending', 'active', 'expired', 'cancelled'];
const CLAIM_STATUSES  = ['pending', 'approved', 'rejected'];

export const mapPolicyType   = v => (typeof v === 'number' ? POLICY_TYPES[v]    : String(v).toLowerCase()) || String(v).toLowerCase();
export const mapPolicyStatus = v => (typeof v === 'number' ? POLICY_STATUSES[v] : String(v).toLowerCase()) || String(v).toLowerCase();
export const mapClaimStatus  = v => (typeof v === 'number' ? CLAIM_STATUSES[v]  : String(v).toLowerCase()) || String(v).toLowerCase();

export const POLICY_TYPE_OPTIONS = [
  { value: 0, label: 'Health' },
  { value: 1, label: 'Life' },
  { value: 2, label: 'Property' },
];

export const POLICY_STATUS_OPTIONS = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Active' },
  { value: 2, label: 'Expired' },
  { value: 3, label: 'Cancelled' },
];

export const CLAIM_STATUS_OPTIONS = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Approved' },
  { value: 2, label: 'Rejected' },
];

export function capitalize(str) {
  if (!str) return '';
  const s = String(str);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Returns YYYY-MM-DD for use in <input type="date"> */
export function toDateInput(iso) {
  if (!iso) return '';
  return iso.split('T')[0];
}

export function getInitials(fullName = '') {
  return fullName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join('')
    .slice(0, 2);
}

const AVATAR_COLORS = [
  { background: '#e6f1fb', color: '#185fa5' },
  { background: '#fbeaf0', color: '#993556' },
  { background: '#eaf3de', color: '#3b6d11' },
  { background: '#eeedfe', color: '#534ab7' },
  { background: '#faeeda', color: '#854f0b' },
];

export function getAvatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}
