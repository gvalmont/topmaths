#!/bin/bash

# Supprime les fichiers du dossier assets avec l'extension .js et .map dont la date de
# dernière modification est plus âgée de X heures par rapport à celle du fichier index.html

TIME_DIFFERENCE_THRESHOLD_IN_HOURS=2
ASSETS_FOLDER_PATH="/home/topmaths/public_html/assets"
INDEX_PATH="/home/topmaths/public_html/index.html"

index_mtime=$(stat -c "%Y" $INDEX_PATH) # index modification time
for file in "$ASSETS_FOLDER_PATH"/*; do
  if [[ -f "$file" && ("$file" == *.js || "$file" == *.map) ]]; then # C'est un fichier et il se termine par .js ou .map
    file_mtime=$(stat -c "%Y" "$file") # file modification time
    time_diff=$(((index_mtime - file_mtime) / 60 / 60))
    if ((time_diff >= TIME_DIFFERENCE_THRESHOLD_IN_HOURS)); then
      echo "Deleting file: $file"
      rm "$file"
    fi
  fi
done
