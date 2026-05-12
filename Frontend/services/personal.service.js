async function getAllPersonal() {
  const res = await apiFetch('/personal');
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function getPersonalById(id) {
  const res = await apiFetch('/personal/' + id);
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function getPersonalByLibro(libroId) {
  const res = await apiFetch('/personal/' + libroId + '/libros');
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function createPersonal(datos) {
  const res = await apiFetch('/personal', {
    method: 'POST',
    body: JSON.stringify(datos)
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updatePersonal(id, datos) {
  const res = await apiFetch('/personal/' + id, {
    method: 'PUT',
    body: JSON.stringify(datos)
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function deletePersonal(id) {
  const res = await apiFetch('/personal/' + id, { method: 'DELETE' });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}
