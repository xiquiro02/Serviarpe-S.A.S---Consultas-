async function getAnios() {
  const res = await apiFetch('/anios');
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function createAnio(anio) {
  const res = await apiFetch('/anios', {
    method: 'POST',
    body: JSON.stringify({ anio })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updateAnio(id, anio) {
  const res = await apiFetch('/anios/' + id, {
    method: 'PUT',
    body: JSON.stringify({ anio })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function deleteAnio(id) {
  const res = await apiFetch('/anios/' + id, { method: 'DELETE' });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}
