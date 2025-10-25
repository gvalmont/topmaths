#!/bin/bash

# Load environment variables from a .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set paths from environment variables or use defaults
LOCAL_STATIC_PATH="${LOCAL_STATIC_PATH:-/absolute/path/to/local/static}"
REMOTE_SERVER="${REMOTE_SERVER:-user@server}"
REMOTE_STATIC_PATH="${REMOTE_STATIC_PATH:-~/remote/static/path}"

# Send files to the remote server
rsync -avz ${LOCAL_STATIC_PATH}/ ${REMOTE_SERVER}:${REMOTE_STATIC_PATH}/

echo "Déploiement terminé. Le dossier ${LOCAL_STATIC_PATH} est maintenant accessible sur ${REMOTE_STATIC_PATH}."
