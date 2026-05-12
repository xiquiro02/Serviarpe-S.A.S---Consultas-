async function getLibros() {
  const res = await apiFetch('/libros');
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function getLibroById(id) {
  const res = await apiFetch('/libros/' + id);
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function createLibro(nombre) {
  const res = await apiFetch('/libros', {
    method: 'POST',
    body: JSON.stringify({ nombre })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updateLibro(id, nombre) {
  const res = await apiFetch('/libros/' + id, {
    method: 'PUT',
    body: JSON.stringify({ nombre })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function deleteLibro(id) {
  const res = await apiFetch('/libros/' + id, { method: 'DELETE' });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}
