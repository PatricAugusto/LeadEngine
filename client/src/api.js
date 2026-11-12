async function requestJson(path, options) {
  const response = await fetch(path, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `A solicitação falhou (HTTP ${response.status}).`);
  }
  return result;
}

export function getDashboard() {
  return requestJson('/api/dashboard');
}

export function getSearchSchedule() {
  return requestJson('/api/search-schedule');
}

export function getSearchRuns() {
  return requestJson('/api/search-runs');
}

export function getSearchRun(id) {
  return requestJson(`/api/search-runs/${encodeURIComponent(id)}`);
}

export function getProspects({ page = 1, query = '', status = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), q: query, status });
  return requestJson(`/api/prospects?${params.toString()}`);
}

export function updateProspectStatus(id, status) {
  return requestJson(`/api/prospects/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export function startSearch(states) {
  return requestJson('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ states }),
  });
}

export function saveSearchSchedule({ enabled, frequency, states }) {
  return requestJson('/api/search-schedule', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled, frequency, states }),
  });
}
