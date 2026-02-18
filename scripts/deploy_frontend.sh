#!/usr/bin/env bash
set -Eeuo pipefail

: "${VPS_HOST:?VPS_HOST is required}"
: "${VPS_USER:?VPS_USER is required}"
: "${FRONTEND_PATH:?FRONTEND_PATH is required}"

VPS_PORT="${VPS_PORT:-22}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"
FRONTEND_BUILD_DIR="${FRONTEND_BUILD_DIR:-dist}"
RELEASE_SHA="${RELEASE_SHA:-${GITHUB_SHA:-manual}}"

if [[ ! -d "${FRONTEND_BUILD_DIR}" ]]; then
  echo "Frontend build directory '${FRONTEND_BUILD_DIR}' does not exist" >&2
  exit 1
fi

REMOTE_BASE="${FRONTEND_PATH%/}"
REMOTE_RELEASE="${REMOTE_BASE}/releases/${RELEASE_SHA}"

echo "Deploying frontend release ${RELEASE_SHA} to ${REMOTE_RELEASE}"

ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
  "set -eu; mkdir -p '${REMOTE_BASE}/releases' '${REMOTE_RELEASE}'"

rsync -az --delete \
  -e "ssh -p ${VPS_PORT}" \
  "${FRONTEND_BUILD_DIR}/" \
  "${VPS_USER}@${VPS_HOST}:${REMOTE_RELEASE}/"

ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" "bash -s" <<EOF
set -Eeuo pipefail
BASE='${REMOTE_BASE}'
RELEASE='${REMOTE_RELEASE}'
TMP_LINK="\${BASE}/current_tmp"

ln -sfn "\${RELEASE}" "\${TMP_LINK}"
mv -Tf "\${TMP_LINK}" "\${BASE}/current"

if ls -1d "\${BASE}/releases/"* >/dev/null 2>&1; then
  ls -1dt "\${BASE}"/releases/* | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf --
fi

test -f "\${BASE}/current/index.html"
EOF

echo "Frontend deploy completed"
