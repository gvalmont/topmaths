#!/bin/bash

# Load environment variables from a .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set paths from environment variables or use defaults
LOCAL_VIDEOS_PATH="${LOCAL_VIDEOS_PATH:-/absolute/path/to/local/videos}"
REMOTE_SERVER="${REMOTE_SERVER:-user@server}"
REMOTE_VIDEOS_PATH="${REMOTE_VIDEOS_PATH:-~/remote/videos/path}"

# Send files to the remote server
rsync -avz ${LOCAL_VIDEOS_PATH}/ ${REMOTE_SERVER}:${REMOTE_VIDEOS_PATH}/

echo "Déploiement terminé. Le dossier ${LOCAL_VIDEOS_PATH} est maintenant accessible sur ${REMOTE_VIDEOS_PATH}."
