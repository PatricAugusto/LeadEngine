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

export function getProspects({ page = 1, pageSize = 10, query = '', status = '', state = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    q: query,
    status,
    state,
  });
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

export function getCampaigns() {
  return requestJson('/api/campaigns');
}

export function createCampaign({ name, description }) {
  return requestJson('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
}

export function updateCampaign(id, values) {
  return requestJson(`/api/campaigns/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
}

export function getCampaignProspects(id, { page = 1, query = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), q: query });
  return requestJson(`/api/campaigns/${encodeURIComponent(id)}/prospects?${params.toString()}`);
}

export function addCampaignProspects(id, prospectIds) {
  return requestJson(`/api/campaigns/${encodeURIComponent(id)}/prospects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospectIds }),
  });
}

export function updateCampaignProspect(campaignId, prospectId, status) {
  return requestJson(
    `/api/campaigns/${encodeURIComponent(campaignId)}/prospects/${encodeURIComponent(prospectId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    },
  );
}

export function removeCampaignProspect(campaignId, prospectId) {
  return requestJson(
    `/api/campaigns/${encodeURIComponent(campaignId)}/prospects/${encodeURIComponent(prospectId)}`,
    { method: 'DELETE' },
  );
}

export function getReports() {
  return requestJson('/api/reports');
}
