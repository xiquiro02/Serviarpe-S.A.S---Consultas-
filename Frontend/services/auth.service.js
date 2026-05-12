const AUTH_URL = 'http://localhost:3000/api/auth';

async function loginUsuario(usuario, password) {
  const res = await fetch(AUTH_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

async function registrarUsuario(nombre, usuario, correo, password) {
  const res = await fetch(AUTH_URL + '/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, usuario, correo, password })
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

async function enviarCodigoRecuperacion(correo) {
  const res = await fetch(AUTH_URL + '/recuperar/enviar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo })
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

async function cambiarPasswordConCodigo(correo, codigo, nuevaPassword) {
  const res = await fetch(AUTH_URL + '/recuperar/cambiar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, token: codigo, nuevaPassword })
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
