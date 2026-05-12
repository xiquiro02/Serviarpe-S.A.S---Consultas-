async function getCajas() {
  const res = await apiFetch('/cajas');
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function createCaja(numero, ubicacion) {
  const res = await apiFetch('/cajas', {
    method: 'POST',
    body: JSON.stringify({ numero, ubicacion })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updateCaja(id, numero, ubicacion) {
  const res = await apiFetch('/cajas/' + id, {
    method: 'PUT',
    body: JSON.stringify({ numero, ubicacion })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function deleteCaja(id) {
  const res = await apiFetch('/cajas/' + id, { method: 'DELETE' });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}
