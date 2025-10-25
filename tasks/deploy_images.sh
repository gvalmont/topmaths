#!/bin/bash

# Load environment variables from a .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set paths from environment variables or use defaults
LOCAL_IMAGES_PATH="${LOCAL_IMAGES_PATH:-/absolute/path/to/local/images}"
REMOTE_SERVER="${REMOTE_SERVER:-user@server}"
REMOTE_IMAGES_PATH="${REMOTE_IMAGES_PATH:-~/remote/images/path}"

# Send files to the remote server
rsync -avz ${LOCAL_IMAGES_PATH}/ ${REMOTE_SERVER}:${REMOTE_IMAGES_PATH}/

echo "Déploiement terminé. Le dossier ${LOCAL_IMAGES_PATH} est maintenant accessible sur ${REMOTE_IMAGES_PATH}."
