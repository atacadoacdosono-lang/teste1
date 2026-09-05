#!/usr/bin/env bash
# Roda isso UMA VEZ na VPS (como root), depois de clonar o repositório.
# Instala Docker (se ainda não tiver) e sobe Evolution API + Postgres + Redis.
set -euo pipefail

if ! command -v docker &> /dev/null; then
  echo "Docker não encontrado — instalando..."
  curl -fsSL https://get.docker.com | sh
else
  echo "Docker já instalado, pulando essa etapa."
fi

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Arquivo .env não encontrado em deploy/. Copiando .env.example — EDITE os valores antes de continuar."
  cp .env.example .env
  echo "Edite deploy/.env agora (nano deploy/.env) e rode este script de novo."
  exit 1
fi

docker compose up -d

echo ""
echo "Pronto. Verificando se a Evolution API respondeu..."
sleep 5
curl -sS http://localhost:8080 || echo "(sem resposta ainda — pode levar mais alguns segundos na primeira subida; rode: curl http://localhost:8080)"
