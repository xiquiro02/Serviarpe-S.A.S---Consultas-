async function getUsuarios() {
  const res = await apiFetch('/usuarios');
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function getUsuarioById(id) {
  const res = await apiFetch('/usuarios/' + id);
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function createUsuario(nombre, usuario, correo, password, rol) {
  const res = await apiFetch('/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nombre, usuario, correo, password, rol })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updateUsuario(id, nombre, correo) {
  const res = await apiFetch('/usuarios/' + id, {
    method: 'PUT',
    body: JSON.stringify({ nombre, correo })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updateRolUsuario(id, rol) {
  const res = await apiFetch('/usuarios/' + id + '/rol', {
    method: 'PATCH',
    body: JSON.stringify({ rol })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function updatePasswordUsuario(id, passwordActual, nuevaPassword) {
  const res = await apiFetch('/usuarios/' + id + '/password', {
    method: 'PATCH',
    body: JSON.stringify({ passwordActual, nuevaPassword })
  });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}

async function deleteUsuario(id) {
  const res = await apiFetch('/usuarios/' + id, { method: 'DELETE' });
  if (!res) return { ok: false, data: null };
  const data = await res.json();
  return { ok: res.ok, data };
}
