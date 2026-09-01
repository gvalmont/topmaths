#!/usr/bin/env bash

set -Eeuo pipefail

# Load environment variables from a .env file.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

required_variables=(
  LOCAL_DIST_PATH
  REMOTE_SERVER
  REMOTE_BUILDS_PATH
  REMOTE_DIST_PATH
  REMOTE_STATIC_PATH
  REMOTE_IMAGES_PATH
  REMOTE_VIDEOS_PATH
)

for variable_name in "${required_variables[@]}"; do
  if [[ -z "${!variable_name:-}" ]]; then
    echo "Erreur : la variable ${variable_name} doit être définie dans .env." >&2
    exit 1
  fi
done

if [[ ! -d "$LOCAL_DIST_PATH" ]]; then
  echo "Erreur : le dossier de build local n'existe pas : ${LOCAL_DIST_PATH}" >&2
  exit 1
fi

if [[ ! -f "$LOCAL_DIST_PATH/index.html" || ! -d "$LOCAL_DIST_PATH/topmaths" ]]; then
  echo "Erreur : ${LOCAL_DIST_PATH} ne contient pas un build TopMaths complet." >&2
  exit 1
fi

timestamp=$(date +"%Y_%m_%d_%Hh%Mmin%Ss")
remote_current_build_path="${REMOTE_BUILDS_PATH%/}/${timestamp}"

# Resolve ~/ against the remote account without relying on shell expansion after
# variable interpolation.
remote_home=$(ssh "$REMOTE_SERVER" 'printf %s "$HOME"')
if [[ "$remote_home" != /* || "$remote_home" == *$'\n'* ]]; then
  echo "Erreur : impossible de déterminer le dossier personnel distant." >&2
  exit 1
fi

resolve_remote_path() {
  local path="$1"

  case "$path" in
    '~') printf '%s\n' "$remote_home" ;;
    '~/'*) printf '%s/%s\n' "$remote_home" "${path#\~/}" ;;
    /*) printf '%s\n' "$path" ;;
    *)
      echo "Erreur : le chemin distant doit être absolu ou commencer par ~/ : ${path}" >&2
      return 1
      ;;
  esac
}

remote_current_build_absolute=$(resolve_remote_path "$remote_current_build_path")
remote_dist_absolute=$(resolve_remote_path "$REMOTE_DIST_PATH")
remote_static_absolute=$(resolve_remote_path "$REMOTE_STATIC_PATH")
remote_images_absolute=$(resolve_remote_path "$REMOTE_IMAGES_PATH")
remote_videos_absolute=$(resolve_remote_path "$REMOTE_VIDEOS_PATH")

# Resolve remote paths and create a fresh build directory. The public symlink is
# deliberately left untouched until every file and asset link is in place.
printf -v remote_prepare_command 'bash -s -- %q %q %q %q %q' \
  "$remote_current_build_absolute" \
  "$remote_dist_absolute" \
  "$remote_static_absolute" \
  "$remote_images_absolute" \
  "$remote_videos_absolute"

ssh "$REMOTE_SERVER" "$remote_prepare_command" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

current_build="$1"
public_link="$2"
static_path="$3"
images_path="$4"
videos_path="$5"

for asset_path in "$static_path" "$images_path" "$videos_path"; do
  if [[ ! -d "$asset_path" ]]; then
    echo "Erreur : le dossier statique distant n'existe pas : ${asset_path}" >&2
    exit 1
  fi
done

if [[ ! -d "$(dirname "$public_link")" ]]; then
  echo "Erreur : le dossier parent du lien public n'existe pas : $(dirname "$public_link")" >&2
  exit 1
fi

mkdir -p "$(dirname "$current_build")"
if [[ -e "$current_build" || -L "$current_build" ]]; then
  echo "Erreur : le dossier de build distant existe déjà : ${current_build}" >&2
  exit 1
fi
mkdir "$current_build"
REMOTE_SCRIPT

# The path is absolute here, so shell-escaping it is safe for rsync's remote shell.
printf -v remote_rsync_path '%q' "${remote_current_build_absolute}/"
rsync -avz --progress "$LOCAL_DIST_PATH/" "${REMOTE_SERVER}:${remote_rsync_path}"

printf -v remote_finalize_command 'bash -s -- %q %q %q %q %q' \
  "$remote_current_build_absolute" \
  "$remote_dist_absolute" \
  "$remote_static_absolute" \
  "$remote_images_absolute" \
  "$remote_videos_absolute"

ssh "$REMOTE_SERVER" "$remote_finalize_command" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

current_build="$1"
public_link="$2"
static_path="$3"
images_path="$4"
videos_path="$5"

if [[ ! -f "$current_build/index.html" || ! -d "$current_build/topmaths" ]]; then
  echo "Erreur : le build distant est incomplet : ${current_build}" >&2
  exit 1
fi

ln -s "$static_path/" "$current_build/static"
ln -s "$images_path/" "$current_build/topmaths/cours-image"
ln -s "$videos_path/" "$current_build/topmaths/cours-video"

if [[ -e "$public_link" && ! -L "$public_link" ]]; then
  echo "Erreur : le chemin public existe mais n'est pas un lien symbolique : ${public_link}" >&2
  exit 1
fi

ln -sfn "$current_build/" "$public_link"
REMOTE_SCRIPT

echo "Déploiement terminé.
  Le site est disponible dans ${remote_current_build_path} et lié à ${REMOTE_DIST_PATH}.
  Le dossier des statiques ${REMOTE_STATIC_PATH} est lié à ${REMOTE_DIST_PATH}/static.
  Le dossier des images ${REMOTE_IMAGES_PATH} est lié à ${REMOTE_DIST_PATH}/topmaths/cours-image.
  Le dossier des vidéos ${REMOTE_VIDEOS_PATH} est lié à ${REMOTE_DIST_PATH}/topmaths/cours-video."
