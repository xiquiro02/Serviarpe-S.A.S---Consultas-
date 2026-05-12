const IMAGENES_LIBROS = ['libro_azul.png', 'libro_verde.png', 'libro_naranja.png'];

async function cargarDashboard() {
  try {
    const [rPersonal, rCajas, rAnios, rLibros] = await Promise.all([
      getAllPersonal(),
      getCajas(),
      getAnios(),
      getLibros()
    ]);

    if (!rPersonal.ok || !rCajas.ok || !rAnios.ok || !rLibros.ok) return;

    document.getElementById('numCarpetas').textContent = rPersonal.data.length;
    document.getElementById('numCajas').textContent    = rCajas.data.length;

    const spanAnios = document.getElementById('rangoAnios');
    if (rAnios.data.length > 0) {
      const valores = rAnios.data.map(a => a.anio);
      const min = Math.min(...valores);
      const max = Math.max(...valores);
      spanAnios.textContent = min === max ? min : min + ' – ' + max;
    } else {
      spanAnios.textContent = '—';
    }

    const grid = document.getElementById('librosGrid');
    grid.innerHTML = '';

    if (rLibros.data.length === 0) {
      grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;">No hay libros registrados.</p>';
      return;
    }

    rLibros.data.forEach(function (libro, i) {
      const img = IMAGENES_LIBROS[i % IMAGENES_LIBROS.length];
      const a = document.createElement('a');
      a.href      = 'vistaLibros.html?libro_id=' + libro.id;
      a.className = 'link-libros';
      a.innerHTML =
        '<div class="libro-card">' +
          '<img src="../asset/imagenes/' + img + '" alt="' + libro.nombre + '" class="libro-img" />' +
          '<span class="libro-titulo">' + (libro.nombre.charAt(0).toUpperCase() + libro.nombre.slice(1).toLowerCase()) + '</span>' +
        '</div>';
      grid.appendChild(a);
    });
  } catch (err) {
    console.error('Error cargando dashboard:', err);
  }
}

cargarDashboard();
