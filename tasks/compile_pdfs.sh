#!/bin/bash

function compile_pdfs() {
  local typ_directory="$1"
  local pdf_directory="$2"
  local suffix="$3"

  # Clear the destination directory before compiling
  rm -rf "$pdf_directory"/* # This removes all files in the directory
  mkdir -p "$pdf_directory" # Recreate the directory structure if needed

  # Count the total number of .typ files
  local total_files=$(find "$typ_directory" -type f -name "*.typ" | wc -l | xargs)
  local current_file=0

  # Find all files with .typ extension in the directory and its subdirectories
  find "$typ_directory" -type f -name "*.typ" -print0 | while IFS= read -r -d '' file; do
    ((current_file++))
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

    # Display the progression
    echo "Compiling $current_file of $total_files $pdf_directory"

    # Add error handling for the typst compile command
    if typst compile "$file" "$pdf_directory/$parent_directory_name/${modified_file_name}.pdf" --root "src/topmaths/typ/"; then
      :
    else
      echo "Error compiling file: $file $pdf_directory/$parent_directory_name/${modified_file_name}.pdf"
    fi
  done
}

# Call the function with different directories and suffixes
compile_pdfs "src/topmaths/typ/fiches/objectifs" "public/topmaths/fiches/objectifs" "Fiche"
compile_pdfs "src/topmaths/typ/fiches/sequences" "public/topmaths/fiches/sequences" "Fiche"
compile_pdfs "src/topmaths/typ/cours/sequences" "public/topmaths/cours" "Cours"
compile_pdfs "src/topmaths/typ/photocopies" "public/topmaths/photocopies" ""
compile_pdfs "src/topmaths/typ/presentations" "public/topmaths/presentations" ""
compile_pdfs "src/topmaths/typ/tutos" "public/topmaths/tutos" ""
