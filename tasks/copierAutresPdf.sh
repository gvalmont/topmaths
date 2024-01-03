#!/bin/bash

function copy_pdf_files() {
  local pdf_directory="$1"
  local destination_directory="$2"

  # Find all files with .pdf extension in the directory and its subdirectories
  find "$pdf_directory" -type f -name "*.pdf" -print0 | while IFS= read -r -d '' file; do
    parent_directory=$(dirname "$file")
    parent_directory_name=$(basename "$parent_directory")
    file_name=$(basename "$file" ".pdf")

    # Create destination directory if it doesn't exist
    mkdir -p "$destination_directory/$parent_directory_name"

    # Copy PDF file to the destination directory with the modified name
    cp "$file" "$destination_directory/$parent_directory_name/${file_name}.pdf"
  done
}
copy_pdf_files "src/topmaths/pdf/photocopies" "public/topmaths/photocopies"
