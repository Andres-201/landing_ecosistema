"""
Servidor local del sitio — Ecosistema Digital Solidario Cafetero.

Abre la página en tu navegador sin instalar nada (solo Python 3):

    python app.py              -> http://localhost:8000
    python app.py 8080         -> usa otro puerto

Para detenerlo: Ctrl + C
"""
import sys
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

CARPETA_SITIO = Path(__file__).resolve().parent / "sitio"
PUERTO = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Manejador(SimpleHTTPRequestHandler):
    # Tipos de archivo que algunas versiones de Python no reconocen
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
    }

    def log_message(self, formato, *args):
        pass  # sin mensajes por cada archivo servido


def main():
    if not (CARPETA_SITIO / "index.html").exists():
        sys.exit(f"No encuentro {CARPETA_SITIO / 'index.html'}")
    servidor = ThreadingHTTPServer(("127.0.0.1", PUERTO), partial(Manejador, directory=str(CARPETA_SITIO)))
    url = f"http://localhost:{PUERTO}"
    print(f"Sitio disponible en {url}  (Ctrl + C para detener)")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        servidor.server_close()


if __name__ == "__main__":
    main()
