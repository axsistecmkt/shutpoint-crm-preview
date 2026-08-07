# Shutpoint — Landing CRM

Sitio web funcional de **Shutpoint**, el CRM en la nube _powered by axsis_.
Réplica fiel del diseño `shutpoint.com demo design.pdf`, construido como sitio estático (HTML + CSS + JS, sin dependencias ni build).

## Secciones

- **Hero** — "El CRM que necesitas para aumentar tus ganancias" con tarjetas de métricas animadas.
- **Solución tecnológica** — mockups de Mac, iPhone e iPad.
- **Así funciona Shutpoint** — video de YouTube embebido.
- **Herramientas** — 8 herramientas con tooltips descriptivos.
- **Planes y precios** — 4 planes (Freemium, Entrepreneur, Business, Enterprise) con toggle mensual/anual.
- **Empresas que confían en Shutpoint** — carrusel de logos.
- **Testimoniales** — carrusel con autoplay.
- **Contacto** — formulario funcional con validación.

## Estructura

```
index.html      Marcado de todas las secciones
styles.css      Estilos y diseño responsive
script.js       Toggles, tooltips, carruseles y formulario
assets/         Iconos, logos y mockups
serve.ps1       Servidor estático local (PowerShell) para previsualizar
```

## Ejecutar localmente

No requiere Node ni Python. En PowerShell:

```powershell
./serve.ps1
```

Luego abre <http://localhost:8430/>.

También funciona abriendo `index.html` directamente en el navegador.

---

© 2022 Axsis Tecnología S.A de C.V.
