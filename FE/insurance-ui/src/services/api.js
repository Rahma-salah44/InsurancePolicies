import { msalInstance, loginRequest } from '../auth/msalConfig';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7165';


async function getAccessToken() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return null;

  try {
    const result = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return result.accessToken;
  } catch {
    await msalInstance.acquireTokenRedirect({ ...loginRequest, account: accounts[0] });
    return null;
  }
}

async function request(path, options = {}) {
  const token = await getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = await res.text(); } catch {}
    throw new Error(msg || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get:    (path)       => request(path),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
};
