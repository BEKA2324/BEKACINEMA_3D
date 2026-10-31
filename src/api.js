export async function api(path, options = {}) {
  const token = localStorage.getItem('cineva_token');
  let response;
  try {
    response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch {
    throw new Error('Backendga ulanib bo‘lmadi. Backend serverini ishga tushiring va API manzilini tekshiring.');
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    if (response.status === 401 && token) window.dispatchEvent(new Event('cineva:unauthorized'));
    throw new Error(data?.message || 'So‘rov bajarilmadi.');
  }
  return data;
}
