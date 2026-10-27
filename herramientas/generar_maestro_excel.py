"""
Genera el Archivo Maestro en Excel a partir del contenido actual del sitio.

Uso (desde la carpeta del proyecto):
    pip install openpyxl
    python herramientas/generar_maestro_excel.py

Lee:      sitio/js/contenido.js
Escribe:  documentos/Maestro_Ecosistema_Cafetero.xlsx
"""
import json, re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONTENIDO = RAIZ / "sitio" / "js" / "contenido.js"
SALIDA = RAIZ / "documentos" / "Maestro_Ecosistema_Cafetero.xlsx"

def leer_contenido(ruta):
    """Extrae el objeto window.SITE de contenido.js (está escrito como JSON)."""
    txt = ruta.read_text(encoding="utf-8")
    inicio = txt.index("window.SITE =") + len("window.SITE =")
    return json.loads(txt[inicio:].strip().rstrip(";"))
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

S = leer_contenido(CONTENIDO)
F = "Arial"
GREEN = "1C3A2B"; CHERRY = "B3243A"
hdr_fill = PatternFill("solid", fgColor=GREEN)
id_fill = PatternFill("solid", fgColor="E7EBE5")
edit_fill = PatternFill("solid", fgColor="FFF8DC")
thin = Side(style="thin", color="D5DBD2")
B = Border(left=thin, right=thin, top=thin, bottom=thin)
ESTADOS = ["Del documento", "Real", "Ejemplo", "Por confirmar", "NUEVO", "ELIMINAR"]

def estado(*vals):
    t = " ".join(str(v) for v in vals)
    if re.search(r"por confirmar|por definir|por designar|por incorporar", t, re.I):
        return "Por confirmar"
    return "Del documento"

wb = Workbook()
readme = wb.active
readme.title = "LÉEME"

def sheet(name, desc, cols, rows, widths=None):
    ws = wb.create_sheet(name)
    ws["A1"] = name; ws["A1"].font = Font(name=F, bold=True, size=14, color=GREEN)
    ws["A2"] = desc; ws["A2"].font = Font(name=F, italic=True, size=10, color="56665C")
    allc = ["ID"] + cols + ["Estado", "Notas para Claude"]
    for i, c in enumerate(allc, 1):
        cell = ws.cell(row=4, column=i, value=c)
        cell.font = Font(name=F, bold=True, color="FFFFFF"); cell.fill = hdr_fill
        cell.alignment = Alignment(vertical="center", wrap_text=True); cell.border = B
    for r, row in enumerate(rows, 5):
        for i, v in enumerate(row, 1):
            cell = ws.cell(row=r, column=i, value=v)
            cell.font = Font(name=F, size=10, bold=(i == 1), color=("56665C" if i == 1 else "000000"))
            cell.alignment = Alignment(vertical="top", wrap_text=True); cell.border = B
            cell.fill = id_fill if i == 1 else (edit_fill if i <= len(cols) + 1 else PatternFill())
        for i in (len(cols) + 2, len(cols) + 3):
            c = ws.cell(row=r, column=i); c.border = B; c.font = Font(name=F, size=10)
            c.alignment = Alignment(vertical="top", wrap_text=True)
    # 20 filas extra para agregar elementos
    last = len(rows) + 4
    for r in range(last + 1, last + 21):
        for i in range(1, len(allc) + 1):
            c = ws.cell(row=r, column=i); c.border = B; c.font = Font(name=F, size=10)
            c.alignment = Alignment(vertical="top", wrap_text=True)
    dv = DataValidation(type="list", formula1='"' + ",".join(ESTADOS) + '"', allow_blank=True)
    ws.add_data_validation(dv)
    col = get_column_letter(len(cols) + 2)
    dv.add(f"{col}5:{col}{last + 20}")
    widths = widths or [24] * len(cols)
    ws.column_dimensions["A"].width = 14
    for i, w in enumerate(widths, 2):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.column_dimensions[get_column_letter(len(cols) + 2)].width = 16
    ws.column_dimensions[get_column_letter(len(cols) + 3)].width = 34
    ws.freeze_panes = "B5"
    ws.row_dimensions[4].height = 30
    return ws

# ---------- Datos generales ----------
gen = [
    ("GEN-01", "Nombre corto del sitio", "Ecosistema Cafetero"),
    ("GEN-02", "Nombre completo del proyecto", "Ecosistema Digital Solidario Cafetero"),
    ("GEN-03", "Región", "Tolima · Colombia"),
    ("GEN-04", "Nombre oficial Asociación A", "Asociación A (por confirmar)"),
    ("GEN-05", "Nombre oficial Asociación B", "Asociación B (por confirmar)"),
    ("GEN-06", "Nombre de la entidad central", "Entidad central (figura jurídica por definir)"),
    ("GEN-07", "Correo de contacto general", "Por confirmar"),
    ("GEN-08", "Teléfono / WhatsApp", "Por confirmar"),
    ("GEN-09", "Dirección física", "Tolima, Colombia (dirección por confirmar)"),
    ("GEN-10", "Instagram (enlace)", "Por confirmar"),
    ("GEN-11", "Facebook (enlace)", "Por confirmar"),
    ("GEN-12", "Otra red (TikTok, YouTube…)", "Por confirmar"),
    ("GEN-13", "Correo que recibe las cotizaciones", "Por confirmar"),
    ("GEN-14", "Aliados que 'Impulsan' (separar con ;)", "Por confirmar"),
    ("GEN-15", "Texto del pie de página", "10 asociaciones, 227 familias y 208 caficultores asociados de siete municipios del Tolima integran su oferta para mejorar su capacidad comercial, su transparencia y su acceso a mercados nacionales e internacionales."),
    ("GEN-16", "Año del copyright", "2026"),
    ("GEN-17", "Lema (tagline)", "Conectando el origen del café con el mundo"),
]
sheet("Datos generales", "Nombres, contactos y redes que aparecen en todo el sitio.", ["Campo", "Valor"],
      [(i, c, v, ("Real" if i in ("GEN-01","GEN-02","GEN-17") else estado(v))) for i, c, v in gen], [36, 70])

# ---------- Textos de páginas ----------
txt = [
    ("TXT-01", "Inicio", "Lema sobre el título", "Conectando el origen del café con el mundo"),
    ("TXT-02", "Inicio", "Título principal", "Cada grano tiene una historia, conectamos su origen con el mundo."),
    ("TXT-03", "Inicio", "Subtítulo", "Descubre las historias detrás de cada finca, conoce a quienes cultivan nuestro café y explora sus orígenes. Una plataforma donde la tradición cafetera, la trazabilidad y la cooperación solidaria abren caminos hacia nuevos mercados."),
    ("TXT-04", "Inicio", "Botón 1", "Solicitar cotización"),
    ("TXT-05", "Inicio", "Botón 2", "Ver el territorio"),
    ("TXT-26", "Inicio", "Título sección mapa", "Dónde nace nuestro café"),
    ("TXT-27", "Inicio", "Texto sección mapa", "Las asociaciones del ecosistema están en siete municipios del Tolima. Toca un municipio en el mapa para ver su información."),
    ("TXT-06", "Inicio", "Título sección 7 pasos", "Del cafetal al comprador, en siete pasos"),
    ("TXT-07", "Inicio", "Título sección trazabilidad", "Cada lote cuenta su historia con un código QR"),
    ("TXT-08", "Inicio", "Texto sección trazabilidad", "El comprador consulta la ficha autorizada del lote: origen por zona, proceso, trilla con balance de masa, bodega y despacho. La ubicación exacta de la finca no se publica sin autorización del productor."),
    ("TXT-09", "Inicio", "Título sección organizaciones", "Organizaciones del ecosistema"),
    ("TXT-10", "El Ecosistema", "Título principal", "Una apuesta colectiva de 10 asociaciones cafeteras"),
    ("TXT-11", "El Ecosistema", "Subtítulo", "Comercialización conjunta, trazabilidad verificable, gestión financiera separada por organización y educación para los productores asociados."),
    ("TXT-12", "El Ecosistema", "¿Qué es? · párrafo 1", "El ecosistema integra el registro de productores, fincas y lotes; la trilla, el almacenamiento y el despacho; la atención a compradores nacionales e internacionales; las ventas por mandato y las liquidaciones; las campañas de promoción y la formación digital de los productores."),
    ("TXT-13", "El Ecosistema", "¿Qué es? · párrafo 2", "La comercialización se hace desde una Unidad Comercial Conjunta. Cada asociación conserva su autonomía sobre productores, lotes, inventarios, trilla, bodega, transporte y pago a sus caficultores."),
    ("TXT-14", "El Ecosistema", "Objetivo general", "Fortalecer la autonomía económica, la asociatividad y el desarrollo sostenible de los pequeños caficultores colombianos mediante un ecosistema digital de propiedad y gestión colectiva que integre asociaciones cafeteras de diferentes regiones del país, facilite el acceso a mercados nacionales e internacionales y promueva la trazabilidad, la transparencia, la formación y la cooperación solidaria."),
    ("TXT-15", "Nuestro Café", "Título principal", "Nuestro café: pergamino seco y verde"),
    ("TXT-16", "Nuestro Café", "Subtítulo", "Lotes identificados por asociación, con trazabilidad autorizada. No publicamos precios: cada negociación se hace con una cotización privada."),
    ("TXT-17", "Solicitar cotización", "Título principal", "Solicita una cotización privada"),
    ("TXT-18", "Solicitar cotización", "Subtítulo", "Pide por lotes específicos o describe lo que necesitas. La Unidad Comercial Conjunta revisa la oferta de ambas asociaciones y te responde con una oferta privada."),
    ("TXT-19", "Productores", "Título principal", "¿Cómo hacer parte del ecosistema?"),
    ("TXT-20", "Productores", "Subtítulo", "Si eres productor de café en el Tolima y perteneces, o quieres pertenecer, a una de las asociaciones, aquí te explicamos qué ganas y cómo vincularte."),
    ("TXT-21", "Productores", "Texto Escuela Cafetera", "Cada asociación administra sus propios cursos, presenciales y virtuales. Los contenidos aprobados se pueden compartir de forma voluntaria en la Biblioteca Cafetera Digital, privada para los productores de ambas asociaciones. Tu progreso y tus evaluaciones siguen siendo de tu asociación."),
    ("TXT-22", "Publicaciones", "Título principal", "Noticias, documentos y sesiones de trabajo"),
    ("TXT-23", "Publicaciones", "Subtítulo", "Lo que avanza en la construcción del ecosistema, publicado para las asociaciones, los productores y los aliados."),
    ("TXT-24", "Todas", "Boletín · título", "Mantente informado"),
    ("TXT-25", "Todas", "Boletín · texto", "Recibe las novedades del ecosistema en tu correo."),
]
sheet("Textos de páginas", "Títulos y párrafos principales de cada página.", ["Página", "Ubicación", "Texto"],
      [(i, p, u, t, ("Real" if i in ("TXT-01","TXT-02","TXT-03","TXT-10","TXT-14") else estado(t))) for i, p, u, t in txt], [18, 28, 80])

sheet("Cifras", "Contadores grandes de la franja verde en Inicio.", ["Número", "Texto debajo"],
      [(f"CIF-{k+1:02}", s["n"], s["t"], ("Real" if k<4 else "Del documento")) for k, s in enumerate(S["stats"])], [12, 50])


AS=S["asociaciones"]
sheet("Asociaciones", "Las 10 asociaciones del ecosistema. Alimenta el mapa, las tarjetas de Inicio, el directorio y el formulario de contacto. Varias variedades, procesos o celulares: separar con ;",
      ["Nombre oficial", "Nombre corto", "Iniciales", "Municipio", "Representante legal", "Dirección", "Celular(es)", "Correo", "N.º de asociados", "Producto", "Variedades", "Procesos", "Archivo de logo"],
      [(f"ASO-{k+1:02}", a["n"], a["corto"], a["sig"], a["mun"], a["rep"], a["dir"], "; ".join(a["tel"]), a["mail"], a["asoc"], a["prod"], "; ".join(a["var"]), "; ".join(a["proc"]), "",
        ("Por confirmar" if a["rep"]=="Por confirmar" or a["mail"].endswith(".co") or "por confirmar" in " ".join(a["var"]) else "Real")) for k, a in enumerate(AS)],
      [44, 26, 9, 14, 26, 32, 22, 32, 11, 30, 34, 22, 16])
from collections import OrderedDict
mm=OrderedDict()
for a in sorted(AS, key=lambda x: x["mun"]): mm.setdefault(a["mun"], []).append(a)
rows=[("TER-TOT","TOTAL","Todo el ecosistema",len(AS),sum(a["asoc"] for a in AS),"","Real")]
for k,(m,l) in enumerate(mm.items()):
    rows.append((f"TER-{k+1:02}", m, "Calculado", len(l), sum(a["asoc"] for a in l), "; ".join(a["corto"] for a in l), "Real"))
sheet("Territorio", "Mapa del Tolima en Inicio. Se calcula solo a partir de la hoja Asociaciones (no hace falta editar aquí).",
      ["Municipio", "Tipo", "Asociaciones", "Asociados", "Asociaciones del municipio"],
      rows, [20, 14, 14, 12, 60])

sheet("Cadena 7 pasos", "Recorrido 'Del cafetal al comprador' en Inicio.",
      ["Título", "Subtítulo", "Responde", "Descripción", "Regla 1 código", "Regla 1 texto", "Regla 2 código", "Regla 2 texto"],
      [(f"PASO-{k+1:02}", j["t"], j["s"], j["who"], j["d"], j["rules"][0][0], j["rules"][0][1],
        j["rules"][1][0] if len(j["rules"]) > 1 else "", j["rules"][1][1] if len(j["rules"]) > 1 else "", "Del documento")
       for k, j in enumerate(S["journey"])], [22, 24, 22, 50, 12, 40, 12, 40])

ICONOS = "layers, route, check, globe, book, chart, users, shield"
sheet("Objetivos", f"Objetivos SMART de la plataforma (36 meses). Meta: número y texto separados por ' | ', varias metas con ';'. Íconos: {ICONOS}.", ["Ícono", "Título", "Descripción", "Meta inicial", "Plazo"],
      [(f"OBJ-{k+1:02}", o["i"], o["t"], o["d"], "; ".join(f"{m[0]} | {m[1]}" for m in o["meta"]), "Primeros 36 meses", "Real") for k, o in enumerate(S["objectives"])], [12, 30, 70, 34, 18])

GR = {"org": "Organización", "prod": "Productor", "ext": "Externo"}
sheet("Actores", "Grupo: Organización, Productor o Externo (sirve para el filtro).", ["Grupo", "Actor", "Responsabilidad", "Límite"],
      [(f"ACT-{k+1:02}", GR[a["g"]], a["t"], a["r"], a["l"], "Del documento") for k, a in enumerate(S["actors"])], [16, 26, 54, 44])

sheet("Órganos gobierno", "Órganos de gobernanza.", ["Órgano", "Papel", "Estado del órgano"],
      [(f"ORG-G{k+1:02}", o["t"], o["d"], o["s"], estado(o["s"])) for k, o in enumerate(S["organs"])], [32, 44, 30])

sheet("Acuerdos", "Decisiones ya acordadas (D-01 a D-18).", ["Código", "Acuerdo"],
      [(f"ACU-{k+1:02}", a[0], a[1], "Del documento") for k, a in enumerate(S["agreements"])], [10, 90])

listas = []
for key, name in [("deadlock", "Resolución de bloqueo"), ("inScope", "Alcance · incluye"), ("outScope", "Alcance · por ahora no"),
                  ("afterQuote", "Qué pasa después de cotizar"), ("school", "Escuela · pasos de un curso"), ("join", "Cómo vincularse")]:
    for k, t in enumerate(S[key]):
        listas.append((f"LIS-{key[:3].upper()}-{k+1:02}", name, k + 1, t, "Del documento"))
sheet("Listas", "Listas numeradas o de viñetas. 'Orden' define la posición.", ["Lista", "Orden", "Texto"], listas, [30, 8, 80])

road = []
for f, r in enumerate(S["road"]):
    for k, it in enumerate(r["items"]):
        road.append((f"RUT-{f+1}-{k+1:02}", r["t"], it, "Del documento"))
sheet("Hoja de ruta", "Etapas MVP, Fase 2 y Fase 3.", ["Etapa", "Ítem"], road, [18, 60])

sheet("Glosario", "Términos de 'El Ecosistema'.", ["Término", "Definición"],
      [(f"GLO-{k+1:02}", g[0], g[1], "Del documento") for k, g in enumerate(S["glossary"])], [24, 80])

sheet("Productos", "Presentaciones de café. Etiquetas separadas con ;", ["Producto", "Descripción", "Etiquetas", "Archivo de foto"],
      [(f"PROD-{k+1:02}", p["t"], p["d"], "; ".join(p["tags"]), "", "Del documento") for k, p in enumerate(S["products"])], [30, 60, 30, 22])

AS2=S["asociaciones"]
sheet("Lotes", "Catálogo y fichas de trazabilidad: 2 lotes por asociación. Variedades: Castillo, Caturra, Borbón rosado, Borbón rojo, Geisha. Procesos: Lavado, Honey, Natural. Kilos sin puntos (50 a 800). Trilla solo para café verde (CPS entrada = verde + subproductos + merma).",
      ["Código lote", "Asociación", "Municipio", "Presentación", "Variedad", "Proceso", "Cosecha", "Kg disponibles", "Humedad",
       "Trilla · kg CPS entrada", "Trilla · kg verde", "Trilla · kg subproductos", "Trilla · kg merma"],
      [(f"LOT-{k+1:02}", l["id"], AS2[l["ai"]]["corto"], AS2[l["ai"]]["mun"], l["pres"], l["var"], l["proc"], l["cos"], l["kg"], l["hum"],
        l.get("cps", ""), l.get("verde", ""), l.get("sub", ""), l.get("merma", ""), "Ejemplo") for k, l in enumerate(S["lots"])],
      [16, 28, 14, 13, 15, 10, 10, 12, 10, 12, 12, 12, 12])
for r in range(5, 5+len(S["lots"])):
    pass

proc = []
PN = {"nac": "Venta nacional", "int": "Venta internacional", "mue": "Muestras", "cam": "Campañas"}
for key, p in S["processes"].items():
    for k, st in enumerate(p["steps"]):
        proc.append((f"PRC-{key.upper()}-{k+1:02}", PN[key], "Paso", k + 1, st, "Del documento"))
    proc.append((f"PRC-{key.upper()}-NOTA", PN[key], "Nota", "", p["note"], "Del documento"))
sheet("Procesos", "Pestañas 'Ventas, muestras y despachos' en Nuestro Café.", ["Proceso", "Tipo", "Orden", "Texto"], proc, [20, 8, 8, 80])

sheet("Beneficios", f"Beneficios para productores. Íconos: {ICONOS}.", ["Ícono", "Título", "Descripción"],
      [(f"BEN-{k+1:02}", b["i"], b["t"], b["d"], "Del documento") for k, b in enumerate(S["benefits"])], [12, 28, 70])

portal = []
for k, p in enumerate(S["portal"]):
    portal.append((f"POR-{k+1}-TIT", p["t"], "Encabezado", p["h"], "Ejemplo"))
    portal.append((f"POR-{k+1}-DES", p["t"], "Descripción", p["p"], "Del documento"))
    for j, kv in enumerate(p["kv"]):
        portal.append((f"POR-{k+1}-D{j+1}", p["t"], kv[0], kv[1], "Ejemplo"))
sheet("Portal productor", "Vista de ejemplo del portal. Campo = etiqueta del dato; Valor = lo que se muestra.", ["Sección", "Campo", "Valor"], portal, [18, 26, 60])

sheet("Directorio", "Contacto de compradores en la página Productores. El contacto de cada asociación sale de la hoja Asociaciones.", ["Organización", "Responsable", "Correo", "Teléfono", "Atención"],
      [(f"DIR-{k+1:02}", d["n"], d["r"], d["c"], "Por confirmar", d["m"], "Por confirmar") for k, d in enumerate(S["directory"])], [28, 28, 30, 18, 30])

CN = {"doc": "Documento", "ses": "Sesión de trabajo", "not": "Noticia", "rec": "Recurso"}
old=[p for p in S["posts"] if not p.get("url")]; new=[p for p in S["posts"] if p.get("url")]
prow=[(f"PUB-{k+1:02}", CN[p["cat"]], p["date"], p["t"], p["d"], "", "", estado(p["date"])) for k, p in enumerate(old)]
prow+=[(f"PUB-{len(old)+k+1:02}", CN[p["cat"]], p["date"], p["t"], p["d"], p.get("img","").split("/")[-1], p["url"] + "  (Fuente: " + p["fuente"] + ")", "Real") for k, p in enumerate(new)]
sheet("Publicaciones", "Categoría: Noticia, Recurso, Documento o Sesión de trabajo. Para agregar una noticia, pega el enlace en una fila vacía con Estado NUEVO; yo completo el resumen.",
      ["Categoría", "Fecha", "Título", "Resumen", "Archivo de imagen", "Texto completo / enlace"],
      prow,
      [18, 18, 40, 60, 20, 40])

img = [
    ("IMG-01", "Logo del proyecto (encabezado, portada y pie)", "logo_ecosistema.jpg", "Recibido y aplicado el 16 oct 2026"),
    ("IMG-02", "Logo Asociación A", "", "Por incorporar"),
    ("IMG-03", "Logo Asociación B", "", "Por incorporar"),
    ("IMG-04", "Foto de portada de Inicio", "portada_cosecha.jpg", "Recibida y aplicada el 23 oct 2026 (reemplaza la foto aérea del cafetal)"),
    ("IMG-05", "Foto sección ¿Qué es?", "", "Opcional (ej.: productores en finca)"),
    ("IMG-06", "Foto productos CPS", "", "Opcional"),
    ("IMG-07", "Foto productos café verde", "", "Opcional"),
    ("IMG-08", "Logos de aliados", "", "Uno por archivo"),
]
sheet("Imágenes", "Escribe el nombre exacto del archivo que me vas a enviar junto con este Excel.", ["Dónde va", "Nombre del archivo", "Situación actual"],
      [(i, a, b, c, ("Real" if i in ("IMG-01","IMG-04") else "Por confirmar")) for i, a, b, c in img], [32, 30, 40])


sheet("Marca", "Paleta oficial tomada de la barra de colores. Uso = dónde aparece en el sitio.", ["Color", "Código HEX", "Uso en el sitio"],
      [("COL-01", "Rosa café (solo marca)", "#975E64", "Logo y palabra ECO del encabezado", "Real"),
       ("COL-06", "Rojo cereza (acento)", "#C0262D", "Botones principales, títulos pequeños y acentos de todo el sitio", "Real"),
       ("COL-07", "Dorado cosecha", "#F6B93B", "Frase destacada del título de portada", "Real"),
       ("COL-02", "Verde café", "#34660F", "Menú activo, enlaces, franja del boletín", "Real"),
       ("COL-03", "Blanco", "#FFFFFF", "Fondo general", "Real"),
       ("COL-04", "Verde salvia", "#8EA47D", "Detalles suaves, fondos de etiquetas, cerezas verdes", "Real"),
       ("COL-05", "Café oscuro", "#32292A", "Textos, franja de cifras y pie de página", "Real"),
       ("TIP-01", "Tipografía títulos", "Montserrat", "Títulos (similar a la del logo)", "Por confirmar"),
       ("TIP-02", "Tipografía textos", "Figtree", "Párrafos y formularios", "Por confirmar")], [22, 14, 60])
ws=wb["Marca"]
from openpyxl.styles import PatternFill as PF
for r in range(5,12):
    hexv=ws.cell(row=r,column=3).value.strip("#"); ws.cell(row=r,column=3).fill=PF("solid",fgColor=hexv)
    if hexv in ("975E64","34660F","32292A","C0262D"): ws.cell(row=r,column=3).font=Font(name=F,size=10,color="FFFFFF",bold=True)

# ---------- LÉEME ----------
readme.column_dimensions["A"].width = 4; readme.column_dimensions["B"].width = 110
lines = [
    ("Archivo Maestro · Ecosistema Cafetero (sitio web)", Font(name=F, bold=True, size=16, color=GREEN)),
    ("Versión 5 · 26 de octubre de 2026 · incluye las 10 asociaciones · corresponde a la página publicada", Font(name=F, italic=True, size=10, color="56665C")),
    ("", None),
    ("Cómo usarlo", Font(name=F, bold=True, size=12, color=CHERRY)),
    ("1. Cada hoja es una sección de la página. Edita solo las celdas amarillas.", None),
    ("2. No cambies la columna ID (gris): es la que me permite saber qué fila modificaste.", None),
    ("3. En 'Estado' elige: Real (ya es información verdadera), Ejemplo, Por confirmar, NUEVO (fila agregada) o ELIMINAR (quitarla del sitio).", None),
    ("4. Para agregar algo (una noticia, un lote, un aliado), usa las filas vacías al final de cada hoja, deja el ID vacío y pon Estado = NUEVO.", None),
    ("5. Si algo no cabe en las columnas, escríbelo en 'Notas para Claude' (por ejemplo: 'mover este paso al final', 'usar foto X').", None),
    ("6. Las fotos y logos envíalos como archivos aparte y escribe su nombre en la hoja 'Imágenes' o en la columna de archivo correspondiente.", None),
    ("7. Cuando termines, súbeme el Excel. Lo comparo con esta versión, te digo qué cambios encontré y actualizo la página.", None),
    ("", None),
    ("Qué significa cada Estado al inicio", Font(name=F, bold=True, size=12, color=CHERRY)),
    ("Del documento: texto tomado del Documento Maestro v2.0 del ecosistema.", None),
    ("Ejemplo: dato inventado para mostrar cómo se verá (lotes, portal del productor). Debe reemplazarse.", None),
    ("Por confirmar: dato que falta (nombres oficiales, contactos, logos, fechas).", None),
    ("", None),
    ("Hojas", Font(name=F, bold=True, size=12, color=CHERRY)),
] + [(f"• {ws.title} — {ws['A2'].value}", None) for ws in wb.worksheets[1:]]
for r, (t, f) in enumerate(lines, 1):
    c = readme.cell(row=r, column=2, value=t); c.font = f or Font(name=F, size=11)
    c.alignment = Alignment(wrap_text=True, vertical="top")
readme.sheet_view.showGridLines = False

SALIDA.parent.mkdir(exist_ok=True)
wb.save(SALIDA)
print("Archivo generado:", SALIDA, "·", len(wb.worksheets), "hojas")
