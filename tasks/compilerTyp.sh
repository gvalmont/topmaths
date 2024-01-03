#!/bin/bash

function compile_typ_files() {
  local typ_directory="$1"
  local pdf_directory="$2"
  local suffix="$3"

  # Find all files with .typ extension in the directory and its subdirectories
  find "$typ_directory" -type f -name "*.typ" -print0 | while IFS= read -r -d '' file; do
    parent_directory=$(dirname "$file")
    parent_directory_name=$(basename "$parent_directory")
    file_name=$(basename "$file" ".typ")

    # Check if the file_name contains a hyphen and is a Fiche
    if [[ "$file_name" == *-* && "$suffix" == "Fiche" ]]; then
      left_of_hyphen="${file_name%-*}"
      right_of_hyphen="${file_name#*-}"
      modified_file_name="${left_of_hyphen}_${suffix}-${right_of_hyphen}"
      # Check if the suffix is empty
    elif [ -z "$suffix" ]; then
      modified_file_name="${file_name}"
    else
      modified_file_name="${file_name}_${suffix}"
    fi

    # Create destination directory if it doesn't exist
    mkdir -p "$pdf_directory/$parent_directory_name"

    # Add error handling for the typst compile command
    if typst compile "$file" "$pdf_directory/$parent_directory_name/${modified_file_name}.pdf" --root "src/topmaths/typ/"; then
      :
    else
      echo "Error compiling file: $file $pdf_directory/$parent_directory_name/${modified_file_name}.pdf"
      # You can add additional actions here, such as exiting the script or logging the error.
    fi
  done
}

# Call the function with different directories and suffixes
compile_typ_files "src/topmaths/typ/fiches/objectifs" "public/topmaths/fiches/objectifs" "Fiche"
compile_typ_files "src/topmaths/typ/fiches/sequences" "public/topmaths/fiches/sequences" "Fiche"
compile_typ_files "src/topmaths/typ/cours/sequences" "public/topmaths/cours" "Cours"
compile_typ_files "src/topmaths/typ/photocopies" "public/topmaths/photocopies" ""
compile_typ_files "src/topmaths/typ/presentations" "public/topmaths/presentations" ""
compile_typ_files "src/topmaths/typ/tutos" "public/topmaths/tutos" ""
