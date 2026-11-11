export async function getDashboard() {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error(`Não foi possível carregar o painel (HTTP ${response.status}).`);
  }

  return response.json();
}
