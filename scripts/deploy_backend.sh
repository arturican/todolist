#!/usr/bin/env bash
set -Eeuo pipefail

: "${VPS_HOST:?VPS_HOST is required}"
: "${VPS_USER:?VPS_USER is required}"
: "${BACKEND_PATH:?BACKEND_PATH is required}"
: "${BACKEND_PORT:?BACKEND_PORT is required}"

VPS_PORT="${VPS_PORT:-22}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"
BACKEND_SOURCE_DIR="${BACKEND_SOURCE_DIR:-backend}"
BACKEND_SERVICE_NAME="${BACKEND_SERVICE_NAME:-todolist-backend}"
BACKEND_ENV_FILE="${BACKEND_ENV_FILE:-/etc/todolist/todolist-backend.env}"
RELEASE_SHA="${RELEASE_SHA:-${GITHUB_SHA:-manual}}"

if [[ ! -d "${BACKEND_SOURCE_DIR}" ]]; then
  echo "Backend source directory '${BACKEND_SOURCE_DIR}' does not exist" >&2
  exit 1
fi

REMOTE_BASE="${BACKEND_PATH%/}"
REMOTE_RELEASE="${REMOTE_BASE}/releases/${RELEASE_SHA}"

echo "Deploying backend release ${RELEASE_SHA} to ${REMOTE_RELEASE}"

ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
  "set -eu; mkdir -p '${REMOTE_BASE}/releases' '${REMOTE_RELEASE}'"

rsync -az --delete \
  -e "ssh -p ${VPS_PORT}" \
  "${BACKEND_SOURCE_DIR}/" \
  "${VPS_USER}@${VPS_HOST}:${REMOTE_RELEASE}/"

ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" "bash -s" <<EOF
set -Eeuo pipefail
BASE='${REMOTE_BASE}'
RELEASE='${REMOTE_RELEASE}'
SERVICE='${BACKEND_SERVICE_NAME}'
ENV_FILE='${BACKEND_ENV_FILE}'
REQUESTED_PORT='${BACKEND_PORT}'
TMP_LINK="\${BASE}/current_tmp"

if [[ ! -f "\${ENV_FILE}" ]]; then
  echo "Environment file not found: \${ENV_FILE}" >&2
  exit 1
fi

cd "\${RELEASE}"

if [[ -f package-lock.json ]]; then
  npm ci --include=dev
else
  npm install --include=dev
fi

npm run prisma:generate

set -a
source "\${ENV_FILE}"
set +a

npm run prisma:deploy
npm run build
npm prune --omit=dev

ln -sfn "\${RELEASE}" "\${TMP_LINK}"
mv -Tf "\${TMP_LINK}" "\${BASE}/current"

sudo systemctl restart "\${SERVICE}"
sudo systemctl status "\${SERVICE}" --no-pager --lines=30

HEALTH_PORT="\${PORT:-\${REQUESTED_PORT}}"
HEALTH_URL="http://127.0.0.1:\${HEALTH_PORT}/api/health"

for _ in {1..30}; do
  if curl -fsS "\${HEALTH_URL}" > /dev/null; then
    break
  fi
  sleep 1
done

if ! curl -fsS "\${HEALTH_URL}" > /dev/null; then
  echo "Backend healthcheck failed: \${HEALTH_URL}" >&2
  sudo journalctl -u "\${SERVICE}" -n 120 --no-pager || true
  exit 1
fi

if ls -1d "\${BASE}/releases/"* >/dev/null 2>&1; then
  ls -1dt "\${BASE}"/releases/* | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf --
fi
EOF

echo "Backend deploy completed"
