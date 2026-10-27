# Ecosistema Digital Solidario Cafetero · Sitio web

Sitio institucional de las 10 asociaciones cafeteras del Tolima: portada, mapa interactivo de Colombia y el Tolima, asociaciones, catálogo de lotes con trazabilidad, solicitud de cotización, productores y publicaciones.

El sitio es **HTML + CSS + JavaScript**, sin base de datos. No necesita instalar nada para verse.

## Estructura

```
ecosistema-cafetero/
├── app.py                         Servidor local para ver el sitio (python app.py)
├── LEEME.md                       Este archivo
├── sitio/                         ← ESTA es la carpeta que se sube al hosting
│   ├── index.html                 Estructura de todas las páginas
│   ├── css/
│   │   └── estilos.css            Diseño, colores y tipografías
│   ├── js/
│   │   ├── contenido.js           TEXTOS Y DATOS (lo que más vas a editar)
│   │   ├── mapa-datos.js          Límites de Colombia y municipios del Tolima (DANE)
│   │   └── app.js                 Funcionamiento: mapa, filtros, formularios, navegación
│   └── img/
│       ├── logos/                 Logo completo, emblema, favicon, logo original y paleta
│       ├── fotos/                 Foto de portada y foto aérea del cafetal
│       └── publicaciones/         Portadas de noticias y recursos
├── herramientas/
│   └── generar_maestro_excel.py   Crea el Excel maestro a partir de contenido.js
└── documentos/
    └── Maestro_Ecosistema_Cafetero.xlsx
```

## Cómo verlo en tu computador

- **Opción 1:** doble clic en `sitio/index.html`.
- **Opción 2 (recomendada):** en una terminal, dentro de la carpeta del proyecto:
  ```
  python app.py
  ```
  Se abre en `http://localhost:8000`. Solo necesita Python 3, sin librerías extra.

## Cómo editar el contenido

Todo el texto y los datos están en **`sitio/js/contenido.js`**, organizado por secciones:

| Sección en el archivo | Qué controla |
|---|---|
| `stats` | Cifras de la franja oscura (10 asociaciones, 227 familias…) |
| `asociaciones` | Las 10 asociaciones: nombre, municipio, contacto, asociados, variedades, procesos. Alimenta el mapa, las tarjetas, el directorio y el formulario |
| `territorio` | Número de familias que muestra el mapa |
| `lots` | Lotes del catálogo (campo `ai` = número de la asociación, empezando en 0) |
| `objectives` | Objetivos SMART de la plataforma |
| `posts` | Publicaciones: noticias, recursos, documentos y sesiones |
| `journey`, `actors`, `organs`, `agreements`, `road`, `glossary`… | Resto de secciones informativas |

Los títulos grandes de cada página (portada, encabezados) están en `sitio/index.html`.

Reglas al editar `contenido.js`: deja las comillas dobles y las comas como están, y guarda en UTF-8. Si la página queda en blanco, casi siempre falta una coma o una comilla.

**Imágenes:** pon el archivo en la carpeta `img/` que corresponda y escribe su ruta en `contenido.js`, por ejemplo `"img": "img/publicaciones/mi-noticia.webp"`. Formatos recomendados: `.webp` o `.jpg` de menos de 300 KB.

## Colores y tipografías

Definidos al inicio de `sitio/css/estilos.css` (bloque `:root`):

| Uso | Color |
|---|---|
| Verde café (menú, enlaces) | `#34660F` |
| Rojo cereza (botones, acentos) | `#C0262D` |
| Dorado cosecha (frase de portada) | `#F6B93B` |
| Rosa café (marca "ECO") | `#975E64` |
| Verde salvia | `#8EA47D` |
| Café oscuro (textos, franjas) | `#32292A` |

Tipografías (Google Fonts): **Montserrat** para títulos, **Figtree** para textos.

## Cómo publicarlo en internet

Sube **el contenido de la carpeta `sitio/`** a cualquier hosting de páginas estáticas:

- **Hostinger / cPanel:** a la carpeta `public_html`.
- **Netlify:** arrastra la carpeta `sitio` a app.netlify.com/drop.
- **GitHub Pages / Vercel:** sube la carpeta como sitio estático.

## Pendientes antes de publicar

- **Formularios** (cotización, contacto y boletín): hoy son demostraciones y no envían datos. Hay que conectarlos a un servicio (por ejemplo Formspree, Google Forms, o un correo vía el hosting). La lógica está en `app.js`, buscando `quoteForm`, `contactForm` y `newsForm`.
- **Lotes del catálogo:** son de ejemplo hasta que cada asociación autorice sus lotes reales.
- **Redes sociales, correo y teléfono general:** aparecen "por confirmar" en el pie de página (`index.html`).
- **Productores sin Fronteras:** falta el representante legal.

## Excel maestro

Para regenerar el Excel con el contenido actual:

```
pip install openpyxl
python herramientas/generar_maestro_excel.py
```

Se guarda en `documentos/Maestro_Ecosistema_Cafetero.xlsx`.

## Créditos de datos

- Límites municipales y departamentales: DANE, Marco Geoestadístico Nacional 2018.
- Publicaciones enlazadas: Comité de Cafeteros del Tolima (FNC), Organización Internacional del Café, Cenicafé y SENA. Sus imágenes pertenecen a cada fuente.
