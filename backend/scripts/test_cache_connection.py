"""
Prueba aislada de la conexión a Redis (Upstash) para la capa de caché.

No depende del resto del backend ni de la base de datos PostgreSQL:
solo lee REDIS_URL desde el archivo .env y prueba un ciclo
set -> get -> delete.

Uso:
    python scripts/test_cache_connection.py
"""

import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env", encoding="utf-8")


def main():
    redis_url = os.getenv("REDIS_URL")

    if not redis_url:
        print("REDIS_URL no está configurada en backend/.env")
        print("Agrega una línea como:")
        print("  REDIS_URL=rediss://default:TU_PASSWORD@TU_ENDPOINT.upstash.io:6379")
        sys.exit(1)

    print(f"Probando conexión a: {redis_url.split('@')[-1]}")

    try:
        import redis
    except ImportError:
        print("Falta instalar el paquete 'redis'. Ejecuta: pip install redis")
        sys.exit(1)

    try:
        client = redis.from_url(redis_url, decode_responses=True)

        start = time.perf_counter()
        client.ping()
        elapsed_ms = (time.perf_counter() - start) * 1000

        print(f"OK: ping exitoso ({elapsed_ms:.1f} ms).")

        test_key = "ututor:cache:test"
        test_value = "conexion-ok"

        client.set(test_key, test_value, ex=30)
        retrieved = client.get(test_key)

        if retrieved == test_value:
            print("OK: escritura y lectura de prueba exitosas.")
        else:
            print(f"ADVERTENCIA: se esperaba '{test_value}' y se obtuvo '{retrieved}'.")

        client.delete(test_key)
        print("OK: limpieza de la clave de prueba realizada.")
        print("\nLa conexión a Redis (Upstash) funciona correctamente.")

    except Exception as error:
        print(f"ERROR al conectar con Redis: {error}")
        print(
            "\nRevisa que copiaste la URL completa desde Upstash "
            "(incluye usuario, contraseña, host y puerto), y que el formato "
            "comienza con 'rediss://' (con doble 's', es TLS)."
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
